<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatConversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'mission_id',
        'user_one_id',
        'user_two_id',
        'last_message_at',
    ];

    protected function casts(): array
    {
        return [
            'last_message_at' => 'datetime',
        ];
    }

    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }

    public function userOne(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_one_id');
    }

    public function userTwo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_two_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class)->orderBy('created_at', 'asc');
    }

    public function getOtherParticipant(int $userId): User
    {
        return $this->user_one_id === $userId ? $this->userTwo : $this->userOne;
    }

    public static function findOrCreate(int $missionId, int $userOneId, int $userTwoId): self
    {
        $conversation = self::where('mission_id', $missionId)
            ->where(function ($query) use ($userOneId, $userTwoId) {
                $query->where(function ($q) use ($userOneId, $userTwoId) {
                    $q->where('user_one_id', $userOneId)->where('user_two_id', $userTwoId);
                })->orWhere(function ($q) use ($userOneId, $userTwoId) {
                    $q->where('user_one_id', $userTwoId)->where('user_two_id', $userOneId);
                });
            })
            ->first();

        if (!$conversation) {
            $conversation = self::create([
                'mission_id' => $missionId,
                'user_one_id' => $userOneId,
                'user_two_id' => $userTwoId,
            ]);
        }

        return $conversation;
    }
}
