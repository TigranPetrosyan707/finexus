<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id(); // corresponds to id
            $table->unsignedBigInteger('company_id'); // corresponds to companyId
            $table->string('invoice_number')->unique(); // invoiceNumber
            $table->date('date'); // date
            $table->date('due_date'); // dueDate
            $table->decimal('amount', 15, 2)->default(0); // amount
            $table->decimal('tax', 15, 2)->default(0); // tax
            $table->decimal('total', 15, 2)->default(0); // total
            $table->enum('status', ['pending', 'paid', 'overdue'])->default('pending'); // status
            $table->string('supplier')->nullable(); // supplier
            $table->text('description')->nullable(); // description
            $table->string('category')->nullable(); // category
            $table->timestamps(); // createdAt and updatedAt
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};