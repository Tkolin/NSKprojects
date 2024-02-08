<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('number');
            $table->string('name');
            $table->foreignId('organization_customer_id')->constrained('organizations');
            $table->foreignId('type_project_document_id')->constrained('type_project_documents');
            $table->foreignId('facility_id')->constrained('facilities');
            $table->date('date_signing');
            $table->foreignId('IAD_id')->constrained('initial_authorization_documentations');
            $table->integer('duration');
            $table->date('date_end');
            $table->foreignId('status_id')->constrained('project_statuses');
            $table->date('date_completion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
