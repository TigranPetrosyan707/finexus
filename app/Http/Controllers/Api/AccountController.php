<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AccountController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        return response()->json(['user' => $this->formatUser($user)]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $request->validate([
            'currentPassword' => ['required', 'string'],
            'newPassword' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();
        if (!Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }

        $user->password = $request->newPassword;
        $user->save();

        return response()->json(['message' => 'Password updated']);
    }

    public function updateCompanyInfo(Request $request): JsonResponse
    {
        $user = $request->user();
        if (($user->role ?? '') !== 'company') {
            return response()->json([], 403);
        }

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'siret' => ['nullable', 'string', 'max:100'],
            'country' => ['required', 'string', 'max:100'],
            'address' => ['nullable', 'string', 'max:500'],
            'sector' => ['nullable', 'string', 'max:100'],
            'otherSector' => ['nullable', 'string', 'max:255'],
            'otherCountry' => ['nullable', 'string', 'max:255'],
        ]);

        $companyInfo = $user->company_info ?? [];
        $companyInfo['name'] = $data['name'];
        $companyInfo['registrationNumber'] = $data['siret'] ?? null;
        $companyInfo['country'] = $data['country'];
        $companyInfo['address'] = $data['address'] ?? null;
        $companyInfo['sector'] = $data['sector'] ?? null;
        $companyInfo['otherSector'] = $data['otherSector'] ?? null;
        $companyInfo['otherCountry'] = $data['otherCountry'] ?? null;
        $user->company_info = $companyInfo;
        $user->save();

        return response()->json(['user' => $this->formatUser($user->fresh())]);
    }

    public function updateUserInfo(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validate([
            'firstname' => ['required', 'string', 'max:255'],
            'lastname' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:50'],
            'role' => ['nullable', 'string', 'max:100'],
        ]);

        if (($user->role ?? '') === 'company') {
            $managerInfo = $user->manager_info ?? [];
            $managerInfo['firstname'] = $data['firstname'];
            $managerInfo['lastname'] = $data['lastname'];
            $managerInfo['email'] = $data['email'];
            $managerInfo['phone'] = $data['phone'] ?? null;
            $managerInfo['role'] = $data['role'] ?? null;
            $user->manager_info = $managerInfo;
            $user->email = $data['email'];
        } else {
            $personalInfo = $user->personal_info ?? [];
            $personalInfo['firstname'] = $data['firstname'];
            $personalInfo['lastname'] = $data['lastname'];
            $personalInfo['email'] = $data['email'];
            $personalInfo['phone'] = $data['phone'] ?? null;
            $user->personal_info = $personalInfo;
            $user->email = $data['email'];
        }
        $user->name = trim($data['firstname'] . ' ' . $data['lastname']);
        $user->save();

        return response()->json(['user' => $this->formatUser($user->fresh())]);
    }

    protected function formatUser(?User $user): ?array
    {
        if (!$user) {
            return null;
        }
        return [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
            'role' => $user->role ?? 'company',
            'companyInfo' => $user->company_info,
            'managerInfo' => $user->manager_info,
            'personalInfo' => $user->personal_info,
            'professionalInfo' => $user->professional_info,
            'stripeCustomerId' => $user->stripe_customer_id,
            'stripePaymentMethod' => [
                'id' => $user->stripe_payment_method_id,
                'brand' => $user->stripe_payment_brand,
                'last4' => $user->stripe_payment_last4,
                'expMonth' => $user->stripe_payment_exp_month,
                'expYear' => $user->stripe_payment_exp_year,
            ],
            'createdAt' => $user->created_at?->toIso8601String(),
        ];
    }
}
