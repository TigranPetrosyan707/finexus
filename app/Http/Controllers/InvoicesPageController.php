<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class InvoicesPageController extends Controller
{
    public function index()
    {
        return Inertia::render('Invoices/Invoices');
    }
}
