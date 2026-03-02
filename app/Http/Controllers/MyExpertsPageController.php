<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class MyExpertsPageController extends Controller
{
    public function index()
    {
        return Inertia::render('MyExperts/MyExperts');
    }
}
