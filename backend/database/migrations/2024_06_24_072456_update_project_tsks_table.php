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
        Schema::table('project_tasks', function (Blueprint $table) {
            $table->unsignedBigInteger('executor_id')->nullable();

            $table->foreign('executor_id')->references('id')->on('persons');

        });    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
