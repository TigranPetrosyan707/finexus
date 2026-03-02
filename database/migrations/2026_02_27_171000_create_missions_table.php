<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('missions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('company_id');
            $table->string('title');
            $table->text('description');
            $table->decimal('min_budget', 15, 2)->default(0);
            $table->decimal('max_budget', 15, 2)->default(0);
            $table->unsignedInteger('duration_days')->default(0);
            $table->string('location')->nullable();
            $table->string('section')->nullable();
            $table->string('other_section')->nullable();
            $table->json('requirements')->nullable();
            $table->json('documents')->nullable();
            $table->date('start_date')->nullable();
            $table->date('posted_date')->nullable();
            $table->unsignedInteger('applications')->default(0);
            $table->string('status')->default('active');
            $table->timestamps();

            $table->index('company_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('missions');
    }
};

