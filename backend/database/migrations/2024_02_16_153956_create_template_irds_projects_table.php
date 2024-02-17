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
        Schema::create('template_irds_type_project', function (Blueprint $table) {
            $table->foreignId('project_type_id')->constrained('type_project_documents')->onDelete('cascade');
            $table->foreignId('ird_id')->constrained('initial_authorization_documentations')->onDelete('cascade');
            $table->primary(['project_type_id', 'ird_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_irds_type_project');
    }
};
