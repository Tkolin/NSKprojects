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
        Schema::table('projects', function (Blueprint $table) {

            $table->dropForeign(['status_id']);
            $table->dropColumn('status_id');

        });
        Schema::dropIfExists('project_statuses');

        Schema::create('project_statuses', function (Blueprint $table) {

            $table->string('name_key')->unique();
            $table->string('name');
            $table->timestamps();
            // Установка name_key в качестве первичного ключа
            $table->primary('name_key');
        });
        Schema::table('projects', function (Blueprint $table) {
             $table->string('status_id')->nullable();

            $table->foreign('status_id', 'fk_projects_project_statuses')->references('name_key')->on('project_statuses');
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
