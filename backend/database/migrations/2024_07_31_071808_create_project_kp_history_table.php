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
        Schema::dropIfExists('project_files');
        Schema::dropIfExists('project_type_files');
        Schema::create('project_type_files', function (Blueprint $table) {
            $table->string('name_key')->unique()->primary();
            $table->string('name')->unique();


              $table->timestamps();
        });
        Schema::create('project_files', function (Blueprint $table) {
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('file_id');
            $table->string('type_id');

            $table->integer('number');
            $table->date('date_document');


            $table->foreign('file_id')->references('id')->on('file')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('type_id')->references('name_key')->on('project_type_files')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_kp_history');
    }
};
