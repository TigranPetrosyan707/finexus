<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class AvailableMissionsPageController extends Controller
{
    public function index()
    {
        return Inertia::render('AvailableMissions/AvailableMissions');
    }

    public function show(int $id)
    {
        return Inertia::render('AvailableMissions/MissionDetails', ['id' => $id]);
    }
}
