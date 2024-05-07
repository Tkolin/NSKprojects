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
        Schema::create('project_fenrirs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fenrir_id')->constrained('fenrirs')->nullable();
            $table->foreignId('project_id')->constrained('projects')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fenrirs__project');
    }
};
