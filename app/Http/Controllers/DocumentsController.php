<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DocumentsController
{
    public function index()
    {
        return Inertia::render('Documents/Documents');
    }
}