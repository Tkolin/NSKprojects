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

        Schema::create('template_stages_type_project', function (Blueprint $table) {
            $table->foreignId('project_type_id')->constrained('type_project_documents')->onDelete('cascade');
            $table->foreignId('stages_is')->constrained('stages')->onDelete('cascade');
            $table->primary(['project_type_id', 'stages_is']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_stages_type_project');
    }
};
