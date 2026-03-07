<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class InvoiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'company') {
            return response()->json(['invoices' => []], 200);
        }

        $invoices = Invoice::where('company_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Invoice $i) => $this->formatInvoice($i));

        return response()->json(['invoices' => $invoices]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'company') {
            return response()->json([], 403);
        }

        $data = $request->validate([
            'invoiceNumber' => ['nullable', 'string', 'max:100'],
            'date' => ['required', 'date'],
            'dueDate' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'total' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'in:pending,paid,overdue'],
            'supplier' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        $invoice = new Invoice();
        $invoice->company_id = $user->id;
        $invoice->invoice_number = $data['invoiceNumber'] ?? ('INV-' . time());
        $invoice->date = Carbon::parse($data['date']);
        $invoice->due_date = Carbon::parse($data['dueDate']);
        $invoice->amount = $data['amount'];
        $invoice->tax = $data['tax'] ?? 0;
        $invoice->total = $data['total'] ?? ($data['amount'] + ($data['tax'] ?? 0));
        $invoice->status = $data['status'] ?? 'pending';
        $invoice->supplier = $data['supplier'] ?? null;
        $invoice->description = $data['description'] ?? null;
        $invoice->category = $data['category'] ?? null;
        $invoice->save();

        return response()->json(['invoice' => $this->formatInvoice($invoice)], 201);
    }

    public function show(Request $request, Invoice $invoice): JsonResponse
    {
        if ($invoice->company_id !== $request->user()->id) {
            return response()->json([], 403);
        }
        return response()->json(['invoice' => $this->formatInvoice($invoice)]);
    }

    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        if ($invoice->company_id !== $request->user()->id) {
            return response()->json([], 403);
        }

        $data = $request->validate([
            'invoiceNumber' => ['nullable', 'string', 'max:100'],
            'date' => ['required', 'date'],
            'dueDate' => ['required', 'date'],
            'amount' => ['required', 'numeric', 'min:0'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'total' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'in:pending,paid,overdue'],
            'supplier' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['nullable', 'string', 'max:100'],
        ]);

        $invoice->invoice_number = $data['invoiceNumber'] ?? $invoice->invoice_number;
        $invoice->date = Carbon::parse($data['date']);
        $invoice->due_date = Carbon::parse($data['dueDate']);
        $invoice->amount = $data['amount'];
        $invoice->tax = $data['tax'] ?? 0;
        $invoice->total = $data['total'] ?? ($data['amount'] + ($data['tax'] ?? 0));
        $invoice->status = $data['status'] ?? $invoice->status;
        $invoice->supplier = $data['supplier'] ?? null;
        $invoice->description = $data['description'] ?? null;
        $invoice->category = $data['category'] ?? null;
        $invoice->save();

        return response()->json(['invoice' => $this->formatInvoice($invoice)]);
    }

    public function destroy(Request $request, Invoice $invoice): JsonResponse
    {
        if ($invoice->company_id !== $request->user()->id) {
            return response()->json([], 403);
        }
        $invoice->delete();
        return response()->json(['message' => 'Deleted']);
    }

    public function import(Request $request): JsonResponse
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'company') {
            return response()->json([], 403);
        }

        $request->validate(['invoices' => 'required|array', 'invoices.*' => 'array']);

        $created = [];
        foreach ($request->input('invoices', []) as $row) {
            $data = $this->normalize($row);
            $invoice = new Invoice();
            $invoice->company_id = $user->id;
            $invoice->invoice_number = $data['invoice_number'] ?? ('INV-' . uniqid());
            $invoice->date = isset($data['date']) ? Carbon::parse($data['date']) : now();
            $invoice->due_date = isset($data['due_date']) ? Carbon::parse($data['due_date']) : now();
            $invoice->amount = (float) ($data['amount'] ?? 0);
            $invoice->tax = (float) ($data['tax'] ?? 0);
            $invoice->total = (float) ($data['total'] ?? $invoice->amount + $invoice->tax);
            $invoice->status = $data['status'] ?? 'pending';
            $invoice->supplier = $data['supplier'] ?? null;
            $invoice->description = $data['description'] ?? null;
            $invoice->category = $data['category'] ?? null;
            $invoice->save();
            $created[] = $this->formatInvoice($invoice);
        }

        return response()->json(['invoices' => $created], 201);
    }

    protected function normalize(array $data): array
    {
        $out = [];
        $map = [
            'invoiceNumber' => 'invoice_number',
            'dueDate' => 'due_date',
            'invoice_number' => 'invoice_number',
            'due_date' => 'due_date',
            'date' => 'date', 'amount' => 'amount', 'tax' => 'tax', 'total' => 'total',
            'status' => 'status', 'supplier' => 'supplier', 'description' => 'description', 'category' => 'category',
        ];
        foreach ($map as $key => $snake) {
            if (array_key_exists($key, $data)) {
                $out[$snake] = $data[$key];
            } elseif (array_key_exists($snake, $data)) {
                $out[$snake] = $data[$snake];
            }
        }
        return $out;
    }

    protected function formatInvoice(Invoice $i): array
    {
        return [
            'id' => $i->id,
            'companyId' => $i->company_id,
            'invoiceNumber' => $i->invoice_number,
            'date' => $i->date?->toDateString(),
            'dueDate' => $i->due_date?->toDateString(),
            'amount' => (float) $i->amount,
            'tax' => (float) $i->tax,
            'total' => (float) $i->total,
            'status' => $i->status,
            'supplier' => $i->supplier,
            'description' => $i->description,
            'category' => $i->category,
            'createdAt' => $i->created_at?->toIso8601String(),
            'updatedAt' => $i->updated_at?->toIso8601String(),
        ];
    }
}
