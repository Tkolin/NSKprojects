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
        Schema::create('executor_order_payments', function (Blueprint $table) {
            $table->id();

            // Добавление новых столбцов
            $table->unsignedBigInteger('file_id')->nullable();
            $table->unsignedBigInteger('executor_order_id')->nullable();

            // Добавление внешних ключей
             $table->foreign('file_id')->references('id')->on('file')->onDelete('cascade');
            $table->foreign('executor_order_id')->references('id')->on('executor_orders')->onDelete('cascade');


            $table->enum('status', ['NOT_REQUESTED', 'AWAITING', 'COMPLETED'])->default('NOT_REQUESTED');
            $table->enum('type_payment', ['PREPAYMENT', 'PAYMENT', 'POSTPAYMENT'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('executor_order_payments');
    }
};
