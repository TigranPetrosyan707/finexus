<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchExpertsPageController extends Controller
{
    private const DEFAULT_MIN_PRICE = 0;
    private const DEFAULT_MAX_PRICE = 1000;
    private const DEFAULT_MIN_EXPERIENCE = 0;
    private const DEFAULT_MAX_EXPERIENCE = 11;

    public function index(Request $request): Response
    {
        $search = $request->input('search', '');
        $minPrice = (int) $request->input('minPrice', self::DEFAULT_MIN_PRICE);
        $maxPrice = (int) $request->input('maxPrice', self::DEFAULT_MAX_PRICE);
        $minExperience = (int) $request->input('minExperience', self::DEFAULT_MIN_EXPERIENCE);
        $maxExperience = (int) $request->input('maxExperience', self::DEFAULT_MAX_EXPERIENCE);
        $verifiedOnly = filter_var($request->input('verifiedOnly', false), FILTER_VALIDATE_BOOLEAN);

        $totalExperts = User::where('role', 'expert')->count();

        $query = User::where('role', 'expert');

        if ($search !== '') {
            $term = '%' . trim($search) . '%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)
                    ->orWhere('email', 'like', $term);
            });
        }

        if ($verifiedOnly) {
            $query->whereNotNull('email_verified_at');
        }

        $users = $query->orderBy('name')->limit(500)->get();

        $experts = $users->map(function (User $user) {
            return $this->formatExpert($user);
        })->filter(function (array $expert) use ($minPrice, $maxPrice, $minExperience, $maxExperience, $search) {
            $professional = $expert['professionalInfo'] ?? [];
            $dailyRate = isset($professional['dailyRate']) ? (float) $professional['dailyRate'] : 0;
            if ($dailyRate < $minPrice || $dailyRate > $maxPrice) {
                return false;
            }
            $expYears = (int) ($professional['experience'] ?? 0);
            if ($maxExperience === 11) {
                if ($expYears < $minExperience) {
                    return false;
                }
            } else {
                if ($expYears < $minExperience || $expYears > $maxExperience) {
                    return false;
                }
            }
            if ($search !== '') {
                $profession = (string) ($professional['profession'] ?? '');
                $name = (string) ($expert['name'] ?? '');
                $email = (string) ($expert['email'] ?? '');
                $q = mb_strtolower(trim($search));
                if ($q !== '' && ! str_contains(mb_strtolower($name), $q) && ! str_contains(mb_strtolower($email), $q) && ! str_contains(mb_strtolower($profession), $q)) {
                    return false;
                }
            }
            return true;
        })->values()->all();

        $filters = [
            'search' => $search,
            'minPrice' => $minPrice,
            'maxPrice' => $maxPrice,
            'minExperience' => $minExperience,
            'maxExperience' => $maxExperience,
            'verifiedOnly' => $verifiedOnly,
        ];

        return Inertia::render('SearchExperts/SearchExperts', [
            'experts' => $experts,
            'filters' => $filters,
            'totalExperts' => $totalExperts,
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
