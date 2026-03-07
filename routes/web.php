<?php

use App\Http\Controllers\AccountPageController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\AssignedMissionController;
use App\Http\Controllers\Api\AvailableMissionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExpertController;
use App\Http\Controllers\Api\ExpertProfileController;
use App\Http\Controllers\Api\HireRequestController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\AuthController;
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
use App\Http\Controllers\MissionController;
use App\Http\Controllers\MyExpertsPageController;
use App\Http\Controllers\PostMissionPageController;
use App\Http\Controllers\SearchExpertsPageController;
use App\Http\Controllers\SubscriptionPageController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthPageController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/signup', [AuthPageController::class, 'signup']);
    Route::get('/forgot-password', [AuthPageController::class, 'forgotPassword']);
    Route::post('/users/store', [UserController::class, 'store']);
    Route::post('/users/check-email', [UserController::class, 'checkEmail']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

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

    Route::get('/api/missions', [MissionController::class, 'index']);
    Route::post('/api/missions', [MissionController::class, 'store']);
    Route::put('/api/missions/{mission}', [MissionController::class, 'update']);
    Route::delete('/api/missions/{mission}', [MissionController::class, 'destroy']);

    Route::get('/api/user', [AccountController::class, 'show']);
    Route::put('/api/account/password', [AccountController::class, 'updatePassword']);
    Route::put('/api/account/company-info', [AccountController::class, 'updateCompanyInfo']);
    Route::put('/api/account/user-info', [AccountController::class, 'updateUserInfo']);

    Route::get('/api/invoices', [InvoiceController::class, 'index']);
    Route::post('/api/invoices', [InvoiceController::class, 'store']);
    Route::post('/api/invoices/import', [InvoiceController::class, 'import']);
    Route::get('/api/invoices/{invoice}', [InvoiceController::class, 'show']);
    Route::put('/api/invoices/{invoice}', [InvoiceController::class, 'update']);
    Route::delete('/api/invoices/{invoice}', [InvoiceController::class, 'destroy']);

    Route::get('/api/dashboard/company-financial', [DashboardController::class, 'companyFinancial']);
    Route::put('/api/dashboard/company-financial', [DashboardController::class, 'updateCompanyFinancial']);
    Route::get('/api/dashboard/expert-stats', [DashboardController::class, 'expertStats']);
    Route::put('/api/dashboard/expert-stats', [DashboardController::class, 'updateExpertStats']);

    Route::get('/api/expert-profile', [ExpertProfileController::class, 'show']);
    Route::put('/api/expert-profile', [ExpertProfileController::class, 'update']);

    Route::get('/api/experts', [ExpertController::class, 'index']);
    Route::get('/api/experts/my-experts', [ExpertController::class, 'myExperts']);
    Route::get('/api/experts/{id}', [ExpertController::class, 'show']);

    Route::get('/api/assigned-missions', [AssignedMissionController::class, 'index']);

    Route::get('/api/hire-requests', [HireRequestController::class, 'index']);
    Route::post('/api/hire-requests', [HireRequestController::class, 'store']);
    Route::post('/api/hire-requests/{id}/accept', [HireRequestController::class, 'accept']);
    Route::post('/api/hire-requests/{id}/reject', [HireRequestController::class, 'reject']);

    Route::get('/api/available-missions', [AvailableMissionController::class, 'index']);
    Route::get('/api/available-missions/{id}', [AvailableMissionController::class, 'show']);
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
