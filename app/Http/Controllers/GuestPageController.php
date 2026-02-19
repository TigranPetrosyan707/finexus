<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class GuestPageController extends Controller
{
    public function login()
    {
        return Inertia::render('Login/Login');
    }

    public function signup()
    {
        return Inertia::render('Signup/Signup');
    }

    public function forgotPassword()
    {
        return Inertia::render('ForgotPassword/ForgotPassword');
    }

    public function trial()
    {
        return Inertia::render('Trial/Trial');
    }
}
