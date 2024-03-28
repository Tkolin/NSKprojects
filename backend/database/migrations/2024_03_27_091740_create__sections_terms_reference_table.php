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
        Schema::create('sections_reference', function (Blueprint $table) {
            $table->id();
            $table->string("name")->nullable();
            $table->string("description")->nullable();
            $table->timestamps();
        });
        Schema::create('template_sections_reference', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('section_reference_id')->nullable();
            $table->foreign('section_reference_id')->references('id')->on('sections_reference')->onDelete('set null');
            $table->timestamps();
        });
        Schema::create('project_sections_reference', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('section_reference_id')->nullable();
            $table->foreign('section_reference_id')->references('id')->on('sections_reference')->onDelete('set null');
            $table->string("values")->nullable();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('_sections_terms_reference');
    }
};
