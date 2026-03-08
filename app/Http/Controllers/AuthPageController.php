<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class AuthPageController extends Controller
{
    public function login(Request $request)
    {
        $errors = $request->session()->get('errors');
        $errorBag = $errors ? $errors->getMessages() : [];
        return Inertia::render('Login/Login', ['errors' => $errorBag]);
    }

    public function signup()
    {
        return Inertia::render('Signup/Signup');
    }

    public function forgotPassword()
    {
        return Inertia::render('ForgotPassword/ForgotPassword');
    }
}