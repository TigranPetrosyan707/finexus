<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Mission extends Model
{
    use HasFactory;

    public function company(): BelongsTo
    {
        return $this->belongsTo(User::class, 'company_id');
    }

    protected $fillable = [
        'company_id',
        'title',
        'description',
        'min_budget',
        'max_budget',
        'duration_days',
        'location',
        'section',
        'other_section',
        'requirements',
        'documents',
        'start_date',
        'posted_date',
        'applications',
        'status',
    ];

    protected $casts = [
        'requirements' => 'array',
        'documents' => 'array',
        'start_date' => 'date',
        'posted_date' => 'date',
    ];
}

