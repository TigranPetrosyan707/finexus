<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssignedMission;
use App\Models\HireRequest;
use App\Models\Mission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HireRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $type = $request->input('type', 'hire'); // 'hire' | 'application'

        if ($type === 'hire') {
            if (($user->role ?? '') === 'company') {
                $items = HireRequest::with(['mission', 'expert'])
                    ->where('company_id', $user->id)
                    ->where('type', 'hire')
                    ->orderByDesc('created_at')
                    ->get();
            } elseif (($user->role ?? '') === 'expert') {
                $items = HireRequest::with(['mission', 'company'])
                    ->where('expert_id', $user->id)
                    ->where('type', 'hire')
                    ->orderByDesc('created_at')
                    ->get();
            } else {
                $items = collect();
            }
        } else {
            if (($user->role ?? '') === 'company') {
                $items = HireRequest::with(['mission', 'expert'])
                    ->where('company_id', $user->id)
                    ->where('type', 'application')
                    ->orderByDesc('created_at')
                    ->get();
            } elseif (($user->role ?? '') === 'expert') {
                $items = HireRequest::with(['mission', 'company'])
                    ->where('expert_id', $user->id)
                    ->where('type', 'application')
                    ->orderByDesc('created_at')
                    ->get();
            } else {
                $items = collect();
            }
        }

        $data = $items->map(fn (HireRequest $h) => $this->format($h));
        return response()->json(['data' => $data]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'type' => ['required', 'string', 'in:hire,application'],
            'expertId' => ['required_unless:type,application', 'nullable', 'integer', 'exists:users,id'],
            'missionId' => ['required', 'integer', 'exists:missions,id'],
        ]);

        $type = $data['type'];
        $mission = Mission::find($data['missionId']);
        if (!$mission || $mission->status !== 'active') {
            return response()->json(['message' => 'Mission not available'], 422);
        }

        if ($type === 'hire') {
            if (($user->role ?? '') !== 'company' || $mission->company_id != $user->id) {
                return response()->json([], 403);
            }
            $expertId = (int) $data['expertId'];
            $existing = HireRequest::where('company_id', $user->id)
                ->where('expert_id', $expertId)
                ->where('mission_id', $mission->id)
                ->where('type', 'hire')
                ->first();
            if ($existing) {
                return response()->json(['data' => $this->format($existing)]);
            }
            $hire = new HireRequest();
            $hire->company_id = $user->id;
            $hire->expert_id = $expertId;
            $hire->mission_id = $mission->id;
            $hire->status = 'pending';
            $hire->type = 'hire';
            $hire->initiated_by = 'company';
            $hire->save();
            $hire->load(['mission', 'expert']);
            return response()->json(['data' => $this->format($hire)], 201);
        }

        // application: expert applies to mission
        if (($user->role ?? '') !== 'expert') {
            return response()->json([], 403);
        }
        $existing = HireRequest::where('expert_id', $user->id)
            ->where('mission_id', $mission->id)
            ->where('type', 'application')
            ->first();
        if ($existing) {
            return response()->json(['data' => $this->format($existing)]);
        }
        $hire = new HireRequest();
        $hire->company_id = $mission->company_id;
        $hire->expert_id = $user->id;
        $hire->mission_id = $mission->id;
        $hire->status = 'pending';
        $hire->type = 'application';
        $hire->initiated_by = 'expert';
        $hire->save();
        $hire->load(['mission', 'company']);
        return response()->json(['data' => $this->format($hire)], 201);
    }

    public function accept(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $hire = HireRequest::with(['mission'])->find($id);
        if (!$hire) {
            return response()->json([], 404);
        }
        $canAccept = ($hire->type === 'hire' && $hire->expert_id == $user->id)
            || ($hire->type === 'application' && $hire->company_id == $user->id);
        if (!$canAccept) {
            return response()->json([], 403);
        }
        $hire->status = 'accepted';
        $hire->responded_by = (string) $user->id;
        $hire->save();

        AssignedMission::create([
            'mission_id' => $hire->mission_id,
            'company_id' => $hire->company_id,
            'expert_id' => $hire->expert_id,
            'status' => 'active',
            'start_date' => $hire->mission->start_date ?? now(),
        ]);

        $hire->load(['mission', 'expert', 'company']);
        return response()->json(['data' => $this->format($hire)]);
    }

    public function reject(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $hire = HireRequest::find($id);
        if (!$hire) {
            return response()->json([], 404);
        }
        $canReject = ($hire->type === 'hire' && $hire->expert_id == $user->id)
            || ($hire->type === 'application' && $hire->company_id == $user->id);
        if (!$canReject) {
            return response()->json([], 403);
        }
        $hire->status = 'rejected';
        $hire->responded_by = (string) $user->id;
        $hire->rejection_reason = $request->input('rejectionReason');
        $hire->save();
        $hire->load(['mission', 'expert', 'company']);
        return response()->json(['data' => $this->format($hire)]);
    }

    protected function format(HireRequest $h): array
    {
        $out = [
            'id' => $h->id,
            'companyId' => $h->company_id,
            'expertId' => $h->expert_id,
            'missionId' => $h->mission_id,
            'status' => $h->status,
            'type' => $h->type,
            'initiatedBy' => $h->initiated_by,
            'respondedBy' => $h->responded_by,
            'rejectionReason' => $h->rejection_reason,
            'createdAt' => $h->created_at?->toIso8601String(),
            'updatedAt' => $h->updated_at?->toIso8601String(),
        ];
        if ($h->relationLoaded('mission') && $h->mission) {
            $out['mission'] = [
                'id' => $h->mission->id,
                'title' => $h->mission->title,
                'companyId' => $h->mission->company_id,
            ];
        }
        if ($h->relationLoaded('expert') && $h->expert) {
            $out['expert'] = ['id' => $h->expert->id, 'name' => $h->expert->name, 'email' => $h->expert->email];
        }
        if ($h->relationLoaded('company') && $h->company) {
            $out['company'] = ['id' => $h->company->id, 'name' => $h->company->name];
        }
        return $out;
    }
}
