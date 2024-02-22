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
        Schema::dropIfExists('template_irds_type_project');

        Schema::create('template_irds_type_project', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_type_id')->nullable(false);
            $table->unsignedBigInteger('ird_id')->nullable(false);
            $table->timestamps();
            $table->integer('stage_number')->nullable();
            $table->integer('application_to_project')->nullable();

            $table->unique(['project_type_id', 'ird_id']);
            $table->foreign('project_type_id')->references('id')->on('type_project_documents')->onDelete('cascade');
            $table->foreign('ird_id')->references('id')->on('initial_authorization_documentations')->onDelete('cascade');
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
