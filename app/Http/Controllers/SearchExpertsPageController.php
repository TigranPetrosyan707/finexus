<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class SearchExpertsPageController extends Controller
{
    public function index()
    {
        return Inertia::render('SearchExperts/SearchExperts');
    }
}
