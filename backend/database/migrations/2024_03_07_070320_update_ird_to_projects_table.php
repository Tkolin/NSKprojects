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
        Schema::dropIfExists('project_irds');
        Schema::create('project_irds', function (Blueprint $table) {
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('ird_id')->constrained('initial_authorization_documentations')->onDelete('cascade');

            $table->date('receivedDate')->nullable();
            $table->integer('applicationProject')->nullable();
            $table->integer('stageNumber')->nullable();
            $table->timestamps();
            $table->id();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            //
        });
    }
};
