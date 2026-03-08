<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MissionsPageController extends Controller
{
    public function index()
    {
        return Inertia::render('Missions/Missions');
    }

    public function viewFromRequest(Request $request, int $id): Response
    {
        $mission = Mission::with('company')->find($id);
        if (!$mission) {
            return Inertia::render('Missions/components/MissionViewFromRequest', [
                'id' => $id,
                'mission' => null,
            ]);
        }
        $formatted = $this->formatMission($mission);
        return Inertia::render('Missions/components/MissionViewFromRequest', [
            'id' => $id,
            'mission' => $formatted,
        ]);
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
