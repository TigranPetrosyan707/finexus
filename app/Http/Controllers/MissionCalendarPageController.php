<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class MissionCalendarPageController extends Controller
{
    public function index()
    {
        return Inertia::render('MissionCalendar/MissionCalendar');
    }
}
