<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class ChatPageController extends Controller
{
    public function index()
    {
        return Inertia::render('Chat/Chat');
    }
}
