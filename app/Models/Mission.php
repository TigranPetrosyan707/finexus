<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    use HasFactory;

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

