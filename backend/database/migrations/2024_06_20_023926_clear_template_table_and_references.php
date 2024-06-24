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
        Schema::dropIfExists('template_sections_reference');
        Schema::dropIfExists('template_stages_type_project');
        Schema::dropIfExists('template_tasks_type_project');
        Schema::dropIfExists('project_executors');
        Schema::dropIfExists('template_files');
        Schema::dropIfExists('template_fenrirs_type_project');
        Schema::dropIfExists('template_fenrirs');
        Schema::dropIfExists('type_files');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
