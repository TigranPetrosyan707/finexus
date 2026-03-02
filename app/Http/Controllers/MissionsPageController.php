<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class MissionsPageController extends Controller
{
    public function index()
    {
        return Inertia::render('Missions/Missions');
    }

    public function viewFromRequest(int $id)
    {
        return Inertia::render('Missions/components/MissionViewFromRequest', ['id' => $id]);
    }
}
