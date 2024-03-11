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
        Schema::create('project_tasks_executors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId('project_tasks_id')->constrained('project_tasks');
            $table->foreignId('executor_id')->constrained('persons');
            $table->float("price")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_tasks_executor');
    }
};
