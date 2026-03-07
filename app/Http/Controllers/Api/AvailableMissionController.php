<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HireRequest;
use App\Models\Mission;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailableMissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'expert') {
            return response()->json(['data' => []]);
        }

        $appliedMissionIds = HireRequest::where('expert_id', $user->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->pluck('mission_id');

        $missions = Mission::with('company')
            ->where('status', 'active')
            ->whereNotIn('id', $appliedMissionIds)
            ->orderByDesc('posted_date')
            ->orderByDesc('created_at')
            ->limit(200)
            ->get();

        $data = $missions->map(fn (Mission $m) => $this->formatMission($m));
        return response()->json(['data' => $data]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $mission = Mission::with('company')->where('status', 'active')->find($id);
        if (!$mission) {
            return response()->json([], 404);
        }
        return response()->json(['data' => $this->formatMission($mission)]);
    }

    protected function formatMission(Mission $m): array
    {
        $company = $m->company;
        return [
            'id' => $m->id,
            'title' => $m->title,
            'description' => $m->description,
            'minBudget' => $m->min_budget,
            'maxBudget' => $m->max_budget,
            'durationDays' => $m->duration_days,
            'location' => $m->location,
            'section' => $m->section,
            'otherSection' => $m->other_section,
            'requirements' => $m->requirements ?? [],
            'documents' => $m->documents ?? [],
            'startDate' => $m->start_date?->format('Y-m-d'),
            'postedDate' => $m->posted_date?->format('Y-m-d'),
            'applications' => $m->applications ?? 0,
            'status' => $m->status,
            'companyId' => $m->company_id,
            'company' => $company ? [
                'id' => $company->id,
                'name' => ($company->company_info['name'] ?? null) ?: $company->email,
                'email' => $company->email,
            ] : null,
        ];
    }
}
