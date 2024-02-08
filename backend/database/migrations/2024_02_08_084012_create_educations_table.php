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
        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->string('number');
            $table->foreignId('type_document_id')->constrained('type_education_documents');
            $table->foreignId('institution_id')->constrained('educational_institutions');
            $table->foreignId('qualification_id')->constrained('education_qualifications');
            $table->foreignId('specialization_id')->constrained('education_specializations');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educations');
    }
};
