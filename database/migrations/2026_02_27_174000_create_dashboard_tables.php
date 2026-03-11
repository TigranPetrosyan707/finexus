<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_financial_data', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id')->unique();
            $table->decimal('current_revenue', 15, 2)->default(0);
            $table->decimal('current_margin', 15, 2)->default(0);
            $table->decimal('current_cash', 15, 2)->default(0);
            $table->json('revenue_history')->nullable();
            $table->json('margin_history')->nullable();
            $table->json('expenses')->nullable();
            $table->timestamps();
        });

        Schema::create('expert_stats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('expert_id')->unique();
            $table->unsignedInteger('active_missions')->default(0);
            $table->unsignedInteger('completed_missions')->default(0);
            $table->float('rating')->default(0);
            $table->unsignedInteger('available_missions')->default(0);
            $table->decimal('total_earnings', 15, 2)->default(0);
            $table->unsignedInteger('total_hours')->default(0);
            $table->json('earnings_history')->nullable();
            $table->json('hours_history')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expert_stats');
        Schema::dropIfExists('company_financial_data');
    }
};

