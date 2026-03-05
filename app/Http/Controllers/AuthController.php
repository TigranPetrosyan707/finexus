<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'role' => ['required', 'string', Rule::in(['company', 'expert', 'demo'])],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return redirect()->back()->withErrors([
                'email' => 'User not found. Please sign up first.',
            ])->withInput($request->only('email'));
        }

        $requestRole = $data['role'] === 'demo' ? 'company' : $data['role'];
        if (($user->role ?? 'company') !== $requestRole) {
            $actual = $user->role ?? 'company';
            return redirect()->back()->withErrors([
                'role' => "This email is registered as {$actual}, not as {$data['role']}. Please select the correct role.",
            ])->withInput($request->only('email'));
        }

        if (!Hash::check($data['password'], $user->getAuthPassword())) {
            return redirect()->back()->withErrors([
                'password' => 'Incorrect password.',
            ])->withInput($request->only('email'));
        }

        Auth::login($user, true);

        return redirect('/');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
