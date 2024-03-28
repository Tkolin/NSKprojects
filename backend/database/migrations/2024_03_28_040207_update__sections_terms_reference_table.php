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
        Schema::table('sections_reference', function (Blueprint $table) {
            $table->string("values")->nullable();
        });
        Schema::table('template_sections_reference', function (Blueprint $table) {
            $table->unsignedBigInteger('project_type_id')->nullable();
            $table->foreign('project_type_id')->references('id')->on('type_project_documents')->onDelete('set null');
            $table->string("values")->nullable();

        });
        Schema::table('project_sections_reference', function (Blueprint $table) {
            $table->unsignedBigInteger('project_id')->nullable();
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('set null');
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
