<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('template_stages_type_project');

        Schema::create('template_stages_type_project', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('project_type_id')->nullable(false);
            $table->unsignedBigInteger('stages_is')->nullable(false);
            $table->timestamps();
            $table->integer('stage_number')->nullable();
            $table->integer('application_to_project')->nullable();

            $table->unique(['project_type_id', 'stages_is']);
            $table->foreign('project_type_id')->references('id')->on('type_project_documents')->onDelete('cascade');
            $table->foreign('stages_is')->references('id')->on('initial_authorization_documentations')->onDelete('cascade');
        });
    }
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
};
