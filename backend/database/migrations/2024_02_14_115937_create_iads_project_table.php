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
        Schema::create('iads_project', function (Blueprint $table) {
            $table->id();
            $table->foreignId('iad_id')->nullable()->constrained('initial_authorization_documentations')->onDelete('set null');
            $table->foreignId('projects_id')->nullable()->constrained('projects')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('iads_project');
    }
};
