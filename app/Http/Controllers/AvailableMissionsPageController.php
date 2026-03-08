<?php

namespace App\Http\Controllers;

use App\Models\HireRequest;
use App\Models\Mission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AvailableMissionsPageController extends Controller
{
    private const DEFAULT_MIN_BUDGET = 0;
    private const DEFAULT_MAX_BUDGET = 1000;
    private const DEFAULT_MIN_DURATION = 0;

    public function index(Request $request): Response
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'expert') {
            return Inertia::render('AvailableMissions/AvailableMissions', [
                'missions' => [],
                'filters' => $this->defaultFilters(),
                'totalMissions' => 0,
            ]);
        }

        $appliedMissionIds = HireRequest::where('expert_id', $user->id)
            ->whereIn('status', ['pending', 'accepted'])
            ->pluck('mission_id');

        $baseQuery = Mission::with('company')
            ->where('status', 'active')
            ->whereNotIn('id', $appliedMissionIds)
            ->orderByDesc('posted_date')
            ->orderByDesc('created_at')
            ->limit(200);

        $totalMissions = (clone $baseQuery)->count();

        $search = trim((string) $request->input('search', ''));
        if ($search !== '') {
            $term = '%' . $search . '%';
            $baseQuery->where(function ($q) use ($term) {
                $q->where('title', 'like', $term)
                    ->orWhere('description', 'like', $term)
                    ->orWhere('location', 'like', $term)
                    ->orWhereHas('company', function ($cq) use ($term) {
                        $cq->where('name', 'like', $term)
                            ->orWhere('email', 'like', $term);
                    });
            });
        }

        $minBudget = (int) $request->input('minBudget', self::DEFAULT_MIN_BUDGET);
        $maxBudget = (int) $request->input('maxBudget', self::DEFAULT_MAX_BUDGET);
        $minDuration = (int) $request->input('minDuration', self::DEFAULT_MIN_DURATION);
        $location = $request->input('location', 'all');
        $section = $request->input('section', 'all');

        $allMissions = $baseQuery->get();

        $formatted = $allMissions->map(fn (Mission $m) => $this->formatMission($m));

        $filtered = $formatted->filter(function (array $m) use ($minBudget, $maxBudget, $minDuration, $location, $section) {
            if ($minBudget > 0 || $maxBudget < 1000) {
                $mMin = (int) ($m['minBudget'] ?? 0);
                $mMax = (int) ($m['maxBudget'] ?? 0);
                if ($mMax < $minBudget || $mMin > $maxBudget) {
                    return false;
                }
            }
            if ($minDuration > 0) {
                $dur = (int) ($m['durationDays'] ?? 0);
                if ($dur < $minDuration) {
                    return false;
                }
            }
            if ($location !== 'all' && ($m['location'] ?? '') !== $location) {
                return false;
            }
            if ($section !== 'all' && ($m['section'] ?? '') !== $section) {
                return false;
            }
            return true;
        })->values()->all();

        $filters = [
            'search' => $search,
            'minBudget' => $minBudget,
            'maxBudget' => $maxBudget,
            'minDuration' => $minDuration,
            'location' => $location,
            'section' => $section,
        ];

        return Inertia::render('AvailableMissions/AvailableMissions', [
            'missions' => $filtered,
            'filters' => $filters,
            'totalMissions' => $totalMissions,
        ]);
    }

    public function show(Request $request, int $id): Response
    {
        $user = $request->user();
        $mission = Mission::with('company')->where('status', 'active')->find($id);
        if (!$mission) {
            return Inertia::render('AvailableMissions/MissionDetails', [
                'id' => $id,
                'mission' => null,
                'companyMissions' => [],
            ]);
        }

        $formatted = $this->formatMission($mission);
        $appliedMissionIds = ($user->role ?? '') === 'expert'
            ? HireRequest::where('expert_id', $user->id)->whereIn('status', ['pending', 'accepted'])->pluck('mission_id')
            : collect();
        $companyMissions = [];
        if (($user->role ?? '') === 'expert' && $mission->company_id) {
            $others = Mission::with('company')
                ->where('status', 'active')
                ->where('company_id', $mission->company_id)
                ->where('id', '!=', $id)
                ->whereNotIn('id', $appliedMissionIds)
                ->orderByDesc('posted_date')
                ->limit(10)
                ->get();
            $companyMissions = $others->map(fn (Mission $m) => $this->formatMission($m))->values()->all();
        }

        return Inertia::render('AvailableMissions/MissionDetails', [
            'id' => $id,
            'mission' => $formatted,
            'companyMissions' => $companyMissions,
        ]);
    }

    private function defaultFilters(): array
    {
        return [
            'search' => '',
            'minBudget' => self::DEFAULT_MIN_BUDGET,
            'maxBudget' => self::DEFAULT_MAX_BUDGET,
            'minDuration' => self::DEFAULT_MIN_DURATION,
            'location' => 'all',
            'section' => 'all',
        ];
    }

    private function formatMission(Mission $m): array
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