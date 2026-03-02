<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('company')->after('password');
            $table->json('company_info')->nullable()->after('role');
            $table->json('manager_info')->nullable()->after('company_info');
            $table->json('personal_info')->nullable()->after('manager_info');
            $table->json('professional_info')->nullable()->after('personal_info');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'company_info',
                'manager_info',
                'personal_info',
                'professional_info',
            ]);
        });
    }
};

