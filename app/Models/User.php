<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'company_info',
        'manager_info',
        'personal_info',
        'professional_info',
        'stripe_customer_id',
        'stripe_payment_method_id',
        'stripe_payment_brand',
        'stripe_payment_last4',
        'stripe_payment_exp_month',
        'stripe_payment_exp_year',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'company_info' => 'array',
            'manager_info' => 'array',
            'personal_info' => 'array',
            'professional_info' => 'array',
        ];
    }


    public function canAccessPanel(Panel $panel): bool
    {
        return $this->email === "admin@admin.admin";
    }
}
