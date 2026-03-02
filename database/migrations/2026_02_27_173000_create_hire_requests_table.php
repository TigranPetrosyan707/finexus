<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hire_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('expert_id');
            $table->unsignedBigInteger('mission_id')->nullable();
            $table->string('status')->default('pending');
            $table->string('type')->default('hire');
            $table->string('initiated_by')->default('company');
            $table->string('responded_by')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();

            $table->index('company_id');
            $table->index('expert_id');
            $table->index('mission_id');
            $table->index('status');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hire_requests');
    }
};

