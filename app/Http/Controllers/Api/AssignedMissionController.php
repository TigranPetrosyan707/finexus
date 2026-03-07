<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssignedMission;
use App\Models\Mission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssignedMissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $role = $user->role ?? '';

        if ($role === 'company') {
            $items = AssignedMission::with(['mission', 'expert'])
                ->where('company_id', $user->id)
                ->orderByDesc('created_at')
                ->get();
        } elseif ($role === 'expert') {
            $items = AssignedMission::with(['mission', 'company'])
                ->where('expert_id', $user->id)
                ->orderByDesc('created_at')
                ->get();
        } else {
            $items = collect();
        }

        $data = $items->map(function (AssignedMission $a) use ($role) {
            $mission = $a->mission;
            $payload = [
                'id' => $a->id,
                'missionId' => $a->mission_id,
                'companyId' => $a->company_id,
                'expertId' => $a->expert_id,
                'status' => $a->status,
                'startDate' => $a->start_date?->format('Y-m-d'),
                'endDate' => $a->end_date?->format('Y-m-d'),
                'createdAt' => $a->created_at?->toIso8601String(),
                'updatedAt' => $a->updated_at?->toIso8601String(),
                'mission' => $mission ? [
                    'id' => $mission->id,
                    'title' => $mission->title,
                    'companyId' => $mission->company_id,
                ] : null,
            ];
            if ($role === 'company' && $a->relationLoaded('expert')) {
                $payload['expert'] = $a->expert ? [
                    'id' => $a->expert->id,
                    'name' => $a->expert->name,
                    'email' => $a->expert->email,
                ] : null;
            }
            if ($role === 'expert' && $a->relationLoaded('company')) {
                $payload['company'] = $a->company ? [
                    'id' => $a->company->id,
                    'name' => $a->company->name,
                ] : null;
            }
            return $payload;
        });

        return response()->json(['data' => $data]);
    }
}
