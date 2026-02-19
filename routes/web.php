<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Guest routes
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/login', fn() => Inertia::render('Login/Login'));
    Route::get('/signup', fn() => Inertia::render('Signup/Signup'));
    Route::get('/forgot-password', fn() => Inertia::render('ForgotPassword/ForgotPassword'));
    Route::get('/trial', fn() => Inertia::render('Trial/Trial'));
});

/*
|--------------------------------------------------------------------------
| Auth routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', fn() => Inertia::render('Dashboard/Dashboard'));
    Route::get('/documents', fn() => Inertia::render('Documents/Documents'));
    Route::get('/account', fn() => Inertia::render('Account/Account'));
    Route::get('/search-experts', fn() => Inertia::render('SearchExperts/SearchExperts'));
    Route::get('/missions', fn() => Inertia::render('Missions/Missions'));
    Route::get('/missions/view/{id}', fn($id) =>
        Inertia::render('Missions/components/MissionViewFromRequest', ['id'=>$id])
    );

    Route::get('/my-experts', fn() => Inertia::render('MyExperts/MyExperts'));
    Route::get('/post-mission', fn() => Inertia::render('PostMission/PostMission'));
    Route::get('/chat', fn() => Inertia::render('Chat/Chat'));
    Route::get('/expert-profile', fn() => Inertia::render('ExpertProfile/ExpertProfile'));
    Route::get('/expert/{id}', fn($id) =>
        Inertia::render('ExpertDetails/ExpertDetails', ['id'=>$id])
    );

    Route::get('/subscription', fn() => Inertia::render('Subscription/Subscription'));
    Route::get('/available-missions', fn() => Inertia::render('AvailableMissions/AvailableMissions'));
    Route::get('/available-missions/{id}', fn($id) =>
        Inertia::render('AvailableMissions/MissionDetails', ['id'=>$id])
    );

    Route::get('/invoices', fn() => Inertia::render('Invoices/Invoices'));
    Route::get('/mission-calendar', fn() => Inertia::render('MissionCalendar/MissionCalendar'));
});

/*
|--------------------------------------------------------------------------
| Root redirect (your "/" logic)
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    if (!auth()->check()) {
        return redirect('/login');
    }

    return redirect(
        auth()->user()->role === 'expert'
            ? '/dashboard'
            : '/search-experts'
    );
});
