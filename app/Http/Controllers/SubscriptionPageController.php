<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class SubscriptionPageController extends Controller
{
    public function index()
    {
        return Inertia::render('Subscription/Subscription');
    }
}
