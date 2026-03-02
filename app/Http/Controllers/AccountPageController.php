<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class AccountPageController extends Controller
{
    public function index()
    {
        return Inertia::render('Account/Account');
    }
}

