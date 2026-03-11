<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatConversation;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    /**
     * Get all conversations for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $conversations = ChatConversation::where('user_one_id', $user->id)
            ->orWhere('user_two_id', $user->id)
            ->with(['userOne', 'userTwo', 'mission', 'messages' => function ($query) {
                $query->latest()->limit(1);
            }])
            ->orderBy('last_message_at', 'desc')
            ->get()
            ->map(function ($conversation) use ($user) {
                $otherUser = $conversation->getOtherParticipant($user->id);
                $lastMessage = $conversation->messages->first();
                
                return [
                    'id' => $conversation->id,
                    'missionId' => $conversation->mission_id,
                    'missionTitle' => $conversation->mission?->title,
                    'otherUser' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                    ],
                    'lastMessage' => $lastMessage ? [
                        'message' => $lastMessage->message,
                        'createdAt' => $lastMessage->created_at->toIso8601String(),
                        'isRead' => $lastMessage->is_read,
                    ] : null,
                    'lastMessageAt' => $conversation->last_message_at?->toIso8601String(),
                ];
            });

        return response()->json(['conversations' => $conversations]);
    }

    /**
     * Get or create a conversation for a specific mission.
     */
    public function getOrCreateConversation(Request $request, string $missionId): JsonResponse
    {

        $user = $request->user();
        // Get the mission to find the other participant
        $mission = \App\Models\Mission::findOrFail($missionId);

        // Determine the other user based on user role
        $otherUserId = null;
        if ($user->id === $mission->user_id) {
            // User is the company - get the assigned expert
            $assignedMission = \App\Models\AssignedMission::where('mission_id', $missionId)
                ->where('status', 'active')
                ->first();
            if ($assignedMission) {
                $otherUserId = $assignedMission->expert_id;
            }
        } else {
            // User is the expert - get the company
            $otherUserId = $mission->user_id;
        }

        if (!$otherUserId) {
            return response()->json(['error' => 'No conversation partner found'], 404);
        }

        $conversation = ChatConversation::findOrCreate($missionId, $user->id, $otherUserId);
        
        $otherUser = \App\Models\User::find($otherUserId);
        
        return response()->json([
            'conversation' => [
                'id' => $conversation->id,
                'missionId' => $conversation->mission_id,
                'missionTitle' => $mission->title,
                'otherUser' => [
                    'id' => $otherUser->id,
                    'name' => $otherUser->name,
                ],
            ]
        ]);
    }

    /**
     * Get messages for a specific conversation.
     */
    public function messages(Request $request, int $conversationId): JsonResponse
    {
        $request->validate([
            'limit' => 'nullable|integer|min:1|max:100',
            'before' => 'nullable|date',
        ]);

        $user = $request->user();
        
        $conversation = ChatConversation::where('id', $conversationId)
            ->where(function ($query) use ($user) {
                $query->where('user_one_id', $user->id)
                    ->orWhere('user_two_id', $user->id);
            })
            ->first();

        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        $limit = $request->input('limit', 50);
        
        $messages = ChatMessage::where('conversation_id', $conversationId)
            ->when($request->before, function ($query) use ($request) {
                $query->where('created_at', '<', $request->before);
            })
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'senderId' => $message->sender_id,
                    'message' => $message->message,
                    'isRead' => $message->is_read,
                    'createdAt' => $message->created_at->toIso8601String(),
                ];
            })
            ->reverse()
            ->values();

        return response()->json(['messages' => $messages]);
    }

    /**
     * Send a message to a conversation.
     */
    public function sendMessage(Request $request, int $conversationId): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        $user = $request->user();
        
        $conversation = ChatConversation::where('id', $conversationId)
            ->where(function ($query) use ($user) {
                $query->where('user_one_id', $user->id)
                    ->orWhere('user_two_id', $user->id);
            })
            ->first();

        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        $message = ChatMessage::create([
            'conversation_id' => $conversationId,
            'sender_id' => $user->id,
            'message' => $request->message,
            'is_read' => false,
        ]);

        // Update last message timestamp
        $conversation->update(['last_message_at' => now()]);

        // Broadcast the message via Pusher
        $otherUser = $conversation->getOtherParticipant($user->id);
        
        event(new \App\Events\ChatMessageSent($message, $conversation, $otherUser));

        return response()->json([
            'message' => [
                'id' => $message->id,
                'senderId' => $message->sender_id,
                'message' => $message->message,
                'isRead' => $message->is_read,
                'createdAt' => $message->created_at->toIso8601String(),
            ]
        ], 201);
    }

    /**
     * Mark messages as read.
     */
    public function markAsRead(Request $request, int $conversationId): JsonResponse
    {
        $user = $request->user();
        
        $conversation = ChatConversation::where('id', $conversationId)
            ->where(function ($query) use ($user) {
                $query->where('user_one_id', $user->id)
                    ->orWhere('user_two_id', $user->id);
            })
            ->first();

        if (!$conversation) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        ChatMessage::where('conversation_id', $conversationId)
            ->where('sender_id', '!=', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }
}
