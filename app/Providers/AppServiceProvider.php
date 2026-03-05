<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Inertia::share('auth', function () {
            $user = auth()->user();
            if (!$user) {
                return ['user' => null];
            }
            return [
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                    'role' => $user->role ?? 'company',
                    'companyInfo' => $user->company_info ?? null,
                    'managerInfo' => $user->manager_info ?? null,
                    'personalInfo' => $user->personal_info ?? null,
                    'professionalInfo' => $user->professional_info ?? null,
                ],
            ];
        });
    }
}
