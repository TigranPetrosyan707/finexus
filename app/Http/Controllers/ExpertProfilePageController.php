<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ExpertProfilePageController extends Controller
{
    public function index()
    {
        return Inertia::render('ExpertProfile/ExpertProfile');
    }
}
