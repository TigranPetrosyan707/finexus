<?php

use App\Http\Controllers\AccountPageController;
use App\Http\Controllers\AuthPageController;
use App\Http\Controllers\AvailableMissionsPageController;
use App\Http\Controllers\ChatPageController;
use App\Http\Controllers\DashboardPageController;
use App\Http\Controllers\DocumentsController;
use App\Http\Controllers\ExpertDetailsPageController;
use App\Http\Controllers\ExpertProfilePageController;
use App\Http\Controllers\InvoicesPageController;
use App\Http\Controllers\MissionCalendarPageController;
use App\Http\Controllers\MissionsPageController;
use App\Http\Controllers\MyExpertsPageController;
use App\Http\Controllers\PostMissionPageController;
use App\Http\Controllers\SearchExpertsPageController;
use App\Http\Controllers\SubscriptionPageController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {

    Route::get('/login', [AuthPageController::class, 'login']);
    Route::get('/signup', [AuthPageController::class, 'signup']);
    Route::get('/forgot-password', [AuthPageController::class, 'forgotPassword']);
    Route::get('/trial', [AuthPageController::class, 'trial']);
});

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', [DashboardPageController::class, 'index']);
    Route::get('/documents', [DocumentsController::class, 'index']);
    Route::get('/account', [AccountPageController::class, 'index']);
    Route::get('/search-experts', [SearchExpertsPageController::class, 'index']);
    Route::get('/missions', [MissionsPageController::class, 'index']);
    Route::get('/missions/view/{id}', [MissionsPageController::class, 'viewFromRequest']);

    Route::get('/my-experts', [MyExpertsPageController::class, 'index']);
    Route::get('/post-mission', [PostMissionPageController::class, 'index']);
    Route::get('/chat', [ChatPageController::class, 'index']);
    Route::get('/expert-profile', [ExpertProfilePageController::class, 'index']);
    Route::get('/expert/{id}', [ExpertDetailsPageController::class, 'show']);

    Route::get('/subscription', [SubscriptionPageController::class, 'index']);
    Route::get('/available-missions', [AvailableMissionsPageController::class, 'index']);
    Route::get('/available-missions/{id}', [AvailableMissionsPageController::class, 'show']);

    Route::get('/invoices', [InvoicesPageController::class, 'index']);
    Route::get('/mission-calendar', [MissionCalendarPageController::class, 'index']);
});

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
