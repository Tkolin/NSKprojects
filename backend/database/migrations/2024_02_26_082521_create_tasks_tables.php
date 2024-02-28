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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
        });
        Schema::create('template_tasks_type_project', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId('project_type_id')->nullable()->constrained('type_project_documents')->onDelete('set null');
            $table->foreignId('task_id')->nullable()->constrained('tasks')->onDelete('set null');

            $table->foreignId('inherited_task_id')->nullable()->constrained('template_tasks_type_project')->onDelete('set null');
            $table->integer('stage_number')->nullable();
        });
        Schema::create('project_executors', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId('project_id')->nullable()->constrained('projects')->onDelete('set null');
            $table->foreignId('executor_id')->nullable()->constrained('persons')->onDelete('set null');

            $table->date('date_start')->nullable();
            $table->date('date_end')->nullable();

            $table->integer('price')->nullable();
        });
        Schema::create('project_tasks', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->foreignId('project_executors_id')->nullable()->constrained('project_executors')->onDelete('set null');
            $table->foreignId('task_id')->nullable()->constrained('tasks')->onDelete('set null');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks_tables');
    }
};
