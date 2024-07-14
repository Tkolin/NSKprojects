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
        Schema::create('executor_order_task', function (Blueprint $table) {
            $table->unsignedBigInteger('executor_order_id');
            $table->unsignedBigInteger('project_task_id'); // Use string instead of foreignId

            $table->foreign('executor_order_id')->references('id')->on('executor_orders')->onDelete('cascade');
            $table->foreign('project_task_id')->references('id')->on('project_tasks')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('executor_orders_task');
    }
};
