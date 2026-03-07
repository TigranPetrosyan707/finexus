<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HireRequest extends Model
{
    protected $fillable = [
        'company_id',
        'expert_id',
        'mission_id',
        'status',
        'type',
        'initiated_by',
        'responded_by',
        'rejection_reason',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(User::class, 'company_id');
    }

    public function expert(): BelongsTo
    {
        return $this->belongsTo(User::class, 'expert_id');
    }

    public function mission(): BelongsTo
    {
        return $this->belongsTo(Mission::class);
    }
}
