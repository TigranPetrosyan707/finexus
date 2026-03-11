<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $documents = Document::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Document $doc) => $this->formatDocument($doc));

        return response()->json(['documents' => $documents]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'file' => 'required|file|max:10240|mimes:csv,xlsx,fec,pdf',
            'name' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');

        $path = $file->store('documents/' . $user->id, 'public');
        
        $document = new Document();
        $document->user_id = $user->id;
        $document->name = $request->input('name', $file->getClientOriginalName());
        $document->original_filename = $file->getClientOriginalName();
        $document->path = $path;
        $document->mime_type = $file->getMimeType();
        $document->size = $file->getSize();
        $document->save();

        return response()->json(['document' => $this->formatDocument($document)], 201);
    }

    public function show(Request $request, Document $document): JsonResponse
    {
        if ($document->user_id !== $request->user()->id) {
            return response()->json([], 403);
        }
        return response()->json(['document' => $this->formatDocument($document)]);
    }

    public function update(Request $request, Document $document): JsonResponse
    {
        if ($document->user_id !== $request->user()->id) {
            return response()->json([], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $document->name = $data['name'];
        $document->save();

        return response()->json(['document' => $this->formatDocument($document)]);
    }

    public function destroy(Request $request, Document $document): JsonResponse
    {
        if ($document->user_id !== $request->user()->id) {
            return response()->json([], 403);
        }

        // Delete the file from storage
        if ($document->path && Storage::disk('public')->exists($document->path)) {
            Storage::disk('public')->delete($document->path);
        }

        $document->delete();

        return response()->json(['message' => 'Document deleted successfully']);
    }

    protected function formatDocument(Document $doc): array
    {
        return [
            'id' => $doc->id,
            'userId' => $doc->user_id,
            'name' => $doc->name,
            'originalFilename' => $doc->original_filename,
            'path' => $doc->path,
            'mimeType' => $doc->mime_type,
            'size' => (int) $doc->size,
            'createdAt' => $doc->created_at?->toIso8601String(),
            'updatedAt' => $doc->updated_at?->toIso8601String(),
        ];
    }
}
