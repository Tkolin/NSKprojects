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
            $table->enum('status', ['NOT_EXECUTOR', 'AWAITING','WORKING', 'COMPLETED'])->default('NOT_EXECUTOR');
        });
    }
};

