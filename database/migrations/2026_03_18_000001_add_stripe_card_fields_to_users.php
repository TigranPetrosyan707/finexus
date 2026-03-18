<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('stripe_customer_id')->nullable()->unique();

            $table->string('stripe_payment_method_id')->nullable();
            $table->string('stripe_payment_brand')->nullable();
            $table->string('stripe_payment_last4', 4)->nullable();
            $table->unsignedSmallInteger('stripe_payment_exp_month')->nullable();
            $table->unsignedSmallInteger('stripe_payment_exp_year')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'stripe_customer_id',
                'stripe_payment_method_id',
                'stripe_payment_brand',
                'stripe_payment_last4',
                'stripe_payment_exp_month',
                'stripe_payment_exp_year',
            ]);
        });
    }
};

