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
        Schema::table('executor_orders', function (Blueprint $table) {
            // Добавление новых столбцов
            $table->unsignedBigInteger('original_file_id')->nullable();
            $table->unsignedBigInteger('signed_file_id')->nullable();

            // Добавление внешних ключей
            $table->foreign('original_file_id')->references('id')->on('file')->onDelete('set null');
            $table->foreign('signed_file_id')->references('id')->on('file')->onDelete('set null');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
