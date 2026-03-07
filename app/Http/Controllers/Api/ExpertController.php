<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssignedMission;
use App\Models\HireRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpertController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'expert');
        $search = $request->input('search');
        if ($search && is_string($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('email', 'like', '%' . $search . '%');
            });
        }
        $experts = $query->orderBy('name')->limit(100)->get();
        return response()->json([
            'data' => $experts->map(fn (User $u) => $this->formatExpert($u)),
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $expert = User::where('role', 'expert')->find($id);
        if (!$expert) {
            return response()->json([], 404);
        }
        $assigned = AssignedMission::with('mission')->where('expert_id', $id)->orderByDesc('created_at')->limit(20)->get();
        return response()->json([
            'expert' => $this->formatExpert($expert),
            'assignedMissions' => $assigned->map(fn ($a) => [
                'id' => $a->id,
                'missionId' => $a->mission_id,
                'status' => $a->status,
                'startDate' => $a->start_date?->format('Y-m-d'),
                'endDate' => $a->end_date?->format('Y-m-d'),
                'mission' => $a->mission ? [
                    'id' => $a->mission->id,
                    'title' => $a->mission->title,
                ] : null,
            ]),
        ]);
    }

    /** Experts that the current company has hired or has requests with */
    public function myExperts(Request $request): JsonResponse
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'company') {
            return response()->json(['data' => []]);
        }

        $expertIds = AssignedMission::where('company_id', $user->id)->distinct()->pluck('expert_id')
            ->merge(HireRequest::where('company_id', $user->id)->distinct()->pluck('expert_id'))
            ->unique()
            ->filter();

        $experts = User::whereIn('id', $expertIds)->where('role', 'expert')->get();
        return response()->json([
            'data' => $experts->map(fn (User $u) => $this->formatExpert($u)),
        ]);
    }

    protected function formatExpert(User $user): array
    {
        $personal = $user->personal_info ?? [];
        $professional = $user->professional_info ?? [];
        return [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'personalInfo' => $personal,
            'professionalInfo' => $professional,
            'specialties' => $professional['specialties'] ?? [],
            'description' => $professional['description'] ?? '',
        ];
    }
}
