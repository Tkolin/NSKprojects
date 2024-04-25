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
        Schema::create('formula_variables', function (Blueprint $table) {
            $table->id();
            $table->foreignId('formula_id')->constrained('formulas')->nullable();
            $table->string('name')->nullable();
            $table->string('name-key')->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formula_variables');
    }
};
