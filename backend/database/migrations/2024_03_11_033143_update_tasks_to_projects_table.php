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
        Schema::table('project_tasks', function (Blueprint $table) {
            $table->dropForeign(["project_executors_id"]);
            $table->dropColumn("project_executors_id");
            $table->foreignId('project_id')->constrained('projects');
            $table->foreignId('inherited_task_id')->constrained('project_tasks');
            $table-> integer("stage_number")->nullable();
            $table->float("price")->nullable();
            $table->date("date_start")->nullable();
            $table->date("date_end")->nullable();
            $table->integer("duration")->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            //
        });
    }
};
