<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $role = $request->input('role', 'company');

        $rules = [
            'role' => ['required', 'string', Rule::in(['company', 'expert'])],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'firstname' => ['nullable', 'string', 'max:255'],
            'lastname' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
        ];

        if ($role === 'company') {
            $rules['rs'] = ['required', 'string', 'max:255'];
            $rules['sector'] = ['required', 'string', 'max:100'];
            $rules['country'] = ['required', 'string', 'max:100'];
            $rules['siret'] = ['nullable', 'string', 'max:100'];
            $rules['otherCountry'] = ['nullable', 'string', 'max:255'];
            $rules['otherSector'] = ['nullable', 'string', 'max:255'];
            $rules['role_manager'] = ['nullable', 'string', 'max:100'];
            $rules['otherRole'] = ['nullable', 'string', 'max:255'];
        }

        if ($role === 'expert') {
            $rules['sector'] = ['nullable', 'string', 'max:100'];
            $rules['experience'] = ['nullable', 'string', 'max:100'];
            $rules['dailyRate'] = ['nullable', 'numeric', 'min:0'];
            $rules['linkedin'] = ['nullable', 'string', 'max:500', 'url'];
            $rules['resume'] = ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx'];
        }

        $data = $request->validate($rules);

        $name = trim(($data['firstname'] ?? '') . ' ' . ($data['lastname'] ?? ''));
        if ($name === '') {
            $name = $data['email'];
        }

        $user = new User;
        $user->name = $name;
        $user->email = $data['email'];
        $user->password = $data['password'];
        $user->role = $role;

        if ($role === 'company') {
            $user->company_info = [
                'name' => $data['rs'] ?? '',
                'sector' => $data['sector'] ?? '',
                'otherSector' => $data['otherSector'] ?? null,
                'country' => $data['country'] ?? '',
                'otherCountry' => $data['otherCountry'] ?? null,
                'registrationNumber' => $data['siret'] ?? null,
            ];
            $user->manager_info = [
                'firstname' => $data['firstname'] ?? '',
                'lastname' => $data['lastname'] ?? '',
                'email' => $data['email'] ?? '',
                'phone' => $data['phone'] ?? null,
                'role' => $data['role_manager'] ?? null,
                'otherRole' => $data['otherRole'] ?? null,
            ];
        }

        if ($role === 'expert') {
            $resumePath = null;
            if ($request->hasFile('resume')) {
                $resumePath = $request->file('resume')->store('resumes/' . $request->input('email'), 'local');
            }
            $user->personal_info = [
                'firstname' => $data['firstname'] ?? '',
                'lastname' => $data['lastname'] ?? '',
                'email' => $data['email'] ?? '',
                'phone' => $data['phone'] ?? null,
                'linkedin' => $data['linkedin'] ?? null,
                'resume_path' => $resumePath,
            ];
            $user->professional_info = [
                'profession' => $data['sector'] ?? '',
                'experience' => $data['experience'] ?? null,
                'dailyRate' => isset($data['dailyRate']) ? (float) $data['dailyRate'] : null,
            ];
        }

        $user->save();

        Auth::login($user, true);

        if ($request->wantsJson()) {
            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role,
                    'name' => $user->name,
                ],
            ], 201);
        }

        return redirect('/');
    }

    public function checkEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'role' => 'nullable|string|in:company,expert',
        ]);

        $exists = User::where('email', $request->email)->exists();

        return response()->json(['exists' => $exists]);
    }
}
