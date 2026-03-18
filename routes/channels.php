<?php

use Illuminate\Support\Facades\Broadcast;

// Authorization callback for private chat channels: `chat.{recipientId}`
// We allow access if the authenticated user (or the `X-User-Id` header fallback)
// matches the recipient id for the channel.
Broadcast::channel('chat.{recipient}', function ($user, $recipient) {
    $recipientId = (int) $recipient;

    $authedUserId = $user?->id ?? auth()->id();
    if ($authedUserId) {
        return (int) $authedUserId === $recipientId;
    }

    $headerUserId = request()->header('X-User-Id');
    return $headerUserId !== null && (int) $headerUserId === $recipientId;
});

