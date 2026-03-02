<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assigned_missions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('mission_id');
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('expert_id');
            $table->string('status')->default('pending');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();

            $table->index('mission_id');
            $table->index('company_id');
            $table->index('expert_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assigned_missions');
    }
};

