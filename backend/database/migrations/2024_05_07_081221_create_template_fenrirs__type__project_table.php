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
        Schema::create('template_fenrirs_type_project', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_fenrirs_id')->constrained('template_fenrirs')->nullable();
            $table->foreignId('type_project_id')->constrained('type_project_documents')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('template_fenrirs__type__project');
    }
};
