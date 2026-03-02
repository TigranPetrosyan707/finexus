<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ExpertDetailsPageController extends Controller
{
    public function show(int $id)
    {
        return Inertia::render('ExpertDetails/ExpertDetails', ['id' => $id]);
    }
}
