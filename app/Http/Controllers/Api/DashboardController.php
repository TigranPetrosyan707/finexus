<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function companyFinancial(Request $request): JsonResponse
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'company') {
            return response()->json(['data' => null]);
        }

        $row = DB::table('company_financial_data')->where('company_id', $user->id)->first();
        return response()->json(['data' => $this->formatCompanyFinancial($row)]);
    }

    public function updateCompanyFinancial(Request $request): JsonResponse
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'company') {
            return response()->json([], 403);
        }

        $data = $request->validate([
            'currentRevenue' => ['nullable', 'numeric', 'min:0'],
            'currentMargin' => ['nullable', 'numeric', 'min:0'],
            'currentCash' => ['nullable', 'numeric', 'min:0'],
            'revenueHistory' => ['nullable', 'array'],
            'marginHistory' => ['nullable', 'array'],
            'expenses' => ['nullable', 'array'],
        ]);

        DB::table('company_financial_data')->updateOrInsert(
            ['company_id' => $user->id],
            [
                'current_revenue' => $data['currentRevenue'] ?? 0,
                'current_margin' => $data['currentMargin'] ?? 0,
                'current_cash' => $data['currentCash'] ?? 0,
                'revenue_history' => json_encode($data['revenueHistory'] ?? []),
                'margin_history' => json_encode($data['marginHistory'] ?? []),
                'expenses' => json_encode($data['expenses'] ?? []),
                'updated_at' => now(),
                'created_at' => DB::table('company_financial_data')->where('company_id', $user->id)->value('created_at') ?? now(),
            ]
        );

        $row = DB::table('company_financial_data')->where('company_id', $user->id)->first();
        return response()->json(['data' => $this->formatCompanyFinancial($row)]);
    }

    public function expertStats(Request $request): JsonResponse
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'expert') {
            return response()->json(['data' => null]);
        }

        $row = DB::table('expert_stats')->where('expert_id', $user->id)->first();
        return response()->json(['data' => $this->formatExpertStats($row)]);
    }

    public function updateExpertStats(Request $request): JsonResponse
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'expert') {
            return response()->json([], 403);
        }

        $data = $request->validate([
            'activeMissions' => ['nullable', 'integer', 'min:0'],
            'completedMissions' => ['nullable', 'integer', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0'],
            'availableMissions' => ['nullable', 'integer', 'min:0'],
            'totalEarnings' => ['nullable', 'numeric', 'min:0'],
            'totalHours' => ['nullable', 'integer', 'min:0'],
            'earningsHistory' => ['nullable', 'array'],
            'hoursHistory' => ['nullable', 'array'],
        ]);

        DB::table('expert_stats')->updateOrInsert(
            ['expert_id' => $user->id],
            [
                'active_missions' => $data['activeMissions'] ?? 0,
                'completed_missions' => $data['completedMissions'] ?? 0,
                'rating' => $data['rating'] ?? 0,
                'available_missions' => $data['availableMissions'] ?? 0,
                'total_earnings' => $data['totalEarnings'] ?? 0,
                'total_hours' => $data['totalHours'] ?? 0,
                'earnings_history' => json_encode($data['earningsHistory'] ?? []),
                'hours_history' => json_encode($data['hoursHistory'] ?? []),
                'updated_at' => now(),
                'created_at' => DB::table('expert_stats')->where('expert_id', $user->id)->value('created_at') ?? now(),
            ]
        );

        $row = DB::table('expert_stats')->where('expert_id', $user->id)->first();
        return response()->json(['data' => $this->formatExpertStats($row)]);
    }

    protected function formatCompanyFinancial($row): array
    {
        if (!$row) {
            return [
                'currentRevenue' => 0,
                'currentMargin' => 0,
                'currentCash' => 0,
                'revenueHistory' => [],
                'marginHistory' => [],
                'expenses' => [],
            ];
        }
        $data = (array) $row;
        return [
            'currentRevenue' => (float) ($data['current_revenue'] ?? 0),
            'currentMargin' => (float) ($data['current_margin'] ?? 0),
            'currentCash' => (float) ($data['current_cash'] ?? 0),
            'revenueHistory' => json_decode($data['revenue_history'] ?? '[]', true) ?: [],
            'marginHistory' => json_decode($data['margin_history'] ?? '[]', true) ?: [],
            'expenses' => json_decode($data['expenses'] ?? '[]', true) ?: [],
        ];
    }

    protected function formatExpertStats($row): array
    {
        if (!$row) {
            return [
                'activeMissions' => 0,
                'completedMissions' => 0,
                'rating' => 0,
                'availableMissions' => 0,
                'totalEarnings' => 0,
                'totalHours' => 0,
                'earningsHistory' => [],
                'hoursHistory' => [],
            ];
        }
        $data = (array) $row;
        return [
            'activeMissions' => (int) ($data['active_missions'] ?? 0),
            'completedMissions' => (int) ($data['completed_missions'] ?? 0),
            'rating' => (float) ($data['rating'] ?? 0),
            'availableMissions' => (int) ($data['available_missions'] ?? 0),
            'totalEarnings' => (float) ($data['total_earnings'] ?? 0),
            'totalHours' => (int) ($data['total_hours'] ?? 0),
            'earningsHistory' => json_decode($data['earnings_history'] ?? '[]', true) ?: [],
            'hoursHistory' => json_decode($data['hours_history'] ?? '[]', true) ?: [],
        ];
    }
}
