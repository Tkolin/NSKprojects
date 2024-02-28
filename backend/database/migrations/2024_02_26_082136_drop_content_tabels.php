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
        Schema::dropIfExists('template_content_type_project');
        Schema::dropIfExists('project_contents');
        Schema::dropIfExists('contents');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
