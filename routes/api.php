<?php

use App\Http\Controllers\Api\ChatController;
use Illuminate\Support\Facades\Route;

// Chat routes
Route::middleware('')->group(function () {
    Route::get('/chat/conversations', [ChatController::class, 'index']);
    Route::get('/chat/conversations/mission/{mission_id}', [ChatController::class, 'getOrCreateConversation']);
    Route::get('/chat/conversations/{conversationId}/messages', [ChatController::class, 'messages']);
    Route::post('/chat/conversations/{conversationId}/messages', [ChatController::class, 'sendMessage']);
    Route::post('/chat/conversations/{conversationId}/read', [ChatController::class, 'markAsRead']);
});
