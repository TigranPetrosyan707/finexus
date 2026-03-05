<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MissionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user || ($user->role ?? 'company') !== 'company') {
            return response()->json([], 403);
        }

        $missions = Mission::where('company_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Mission $mission) => $this->toResource($mission));

        return response()->json(['missions' => $missions]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user || ($user->role ?? 'company') !== 'company') {
            return response()->json([], 403);
        }

        $data = $this->validateData($request);

        $mission = new Mission();
        $mission->company_id = $user->id;
        $mission->title = $data['title'];
        $mission->description = $data['description'];
        $mission->min_budget = $data['minBudget'];
        $mission->max_budget = $data['maxBudget'];
        $mission->duration_days = $data['durationDays'];
        $mission->location = $data['location'];
        $mission->section = $data['section'];
        $mission->other_section = $data['otherSection'] ?? null;
        $mission->requirements = $data['requirements'] ?? [];
        $mission->documents = $data['documents'] ?? [];
        $mission->start_date = $data['startDate'];
        $mission->posted_date = now()->toDateString();
        $mission->applications = 0;
        $mission->status = 'active';
        $mission->save();

        return response()->json(['mission' => $this->toResource($mission)], 201);
    }

    public function update(Request $request, Mission $mission): JsonResponse
    {
        $user = $request->user();

        if (! $user || $mission->company_id !== $user->id) {
            return response()->json([], 403);
        }

        $data = $this->validateData($request);

        $mission->title = $data['title'];
        $mission->description = $data['description'];
        $mission->min_budget = $data['minBudget'];
        $mission->max_budget = $data['maxBudget'];
        $mission->duration_days = $data['durationDays'];
        $mission->location = $data['location'];
        $mission->section = $data['section'];
        $mission->other_section = $data['otherSection'] ?? null;
        $mission->requirements = $data['requirements'] ?? [];
        $mission->documents = $data['documents'] ?? [];
        $mission->start_date = $data['startDate'];
        $mission->save();

        return response()->json(['mission' => $this->toResource($mission)]);
    }

    public function destroy(Request $request, Mission $mission): JsonResponse
    {
        $user = $request->user();

        if (! $user || $mission->company_id !== $user->id) {
            return response()->json([], 403);
        }

        $mission->delete();

        return response()->json(['message' => 'Deleted']);
    }

    protected function validateData(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'minBudget' => ['required', 'numeric', 'min:0'],
            'maxBudget' => ['required', 'numeric', 'min:0', 'gte:minBudget'],
            'durationDays' => ['required', 'integer', 'min:1'],
            'location' => ['required', 'string', 'max:255'],
            'section' => ['required', 'string', 'max:100'],
            'otherSection' => ['nullable', 'string', 'max:255'],
            'startDate' => ['required', 'date'],
            'requirements' => ['nullable', 'array'],
            'requirements.*' => ['string', 'max:500'],
            'documents' => ['nullable', 'array'],
        ]);
    }

    protected function toResource(Mission $mission): array
    {
        return [
            'id' => $mission->id,
            'companyId' => $mission->company_id,
            'title' => $mission->title,
            'description' => $mission->description,
            'minBudget' => (float) $mission->min_budget,
            'maxBudget' => (float) $mission->max_budget,
            'durationDays' => (int) $mission->duration_days,
            'location' => $mission->location,
            'section' => $mission->section,
            'otherSection' => $mission->other_section,
            'requirements' => $mission->requirements ?? [],
            'documents' => $mission->documents ?? [],
            'startDate' => optional($mission->start_date)->toDateString(),
            'postedDate' => optional($mission->posted_date)->toDateString(),
            'applications' => (int) $mission->applications,
            'status' => $mission->status,
            'createdAt' => optional($mission->created_at)->toIso8601String(),
            'updatedAt' => optional($mission->updated_at)->toIso8601String(),
        ];
    }
}

