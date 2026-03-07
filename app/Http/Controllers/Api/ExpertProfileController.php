<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssignedMission;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpertProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'expert') {
            return response()->json([], 403);
        }

        $stats = $this->expertStats($user->id);
        return response()->json([
            'expert' => $this->formatExpert($user),
            'stats' => $stats,
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'expert') {
            return response()->json([], 403);
        }

        $data = $request->validate([
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:50'],
            'linkedin' => ['nullable', 'string', 'max:500', 'url'],
            'profession' => ['nullable', 'string', 'max:255'],
            'experience' => ['nullable', 'string', 'max:100'],
            'dailyRate' => ['nullable', 'numeric', 'min:0'],
            'specialties' => ['nullable', 'array'],
            'specialties.*' => ['string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $user->name = trim($data['firstname'] . ' ' . $data['lastname']);
        $user->email = $data['email'];

        $personal = $user->personal_info ?? [];
        $personal['firstname'] = $data['firstname'];
        $personal['lastname'] = $data['lastname'];
        $personal['email'] = $data['email'];
        $personal['phone'] = $data['phone'] ?? null;
        $personal['linkedin'] = $data['linkedin'] ?? null;
        $user->personal_info = $personal;

        $professional = $user->professional_info ?? [];
        $professional['profession'] = $data['profession'] ?? null;
        $professional['experience'] = $data['experience'] ?? null;
        $professional['dailyRate'] = isset($data['dailyRate']) ? (float) $data['dailyRate'] : null;
        $professional['specialties'] = $data['specialties'] ?? [];
        $professional['description'] = $data['description'] ?? null;
        $user->professional_info = $professional;

        $user->save();

        return response()->json([
            'expert' => $this->formatExpert($user->fresh()),
            'stats' => $this->expertStats($user->id),
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

    protected function expertStats(int $expertId): array
    {
        $active = AssignedMission::where('expert_id', $expertId)->whereIn('status', ['pending', 'active'])->count();
        $completed = AssignedMission::where('expert_id', $expertId)->where('status', 'completed')->count();
        return [
            'activeMissions' => $active,
            'completedMissions' => $completed,
            'rating' => 0,
        ];
    }
}
