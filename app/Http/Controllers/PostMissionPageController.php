<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PostMissionPageController extends Controller
{
    public function index()
    {
        return Inertia::render('PostMission/PostMission');
    }
}
