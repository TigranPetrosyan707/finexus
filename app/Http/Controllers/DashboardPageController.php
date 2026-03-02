<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardPageController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Dashboard');
    }
}

