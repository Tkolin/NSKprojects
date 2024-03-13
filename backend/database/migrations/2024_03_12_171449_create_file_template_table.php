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
        Schema::create('template_files', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("name");
            $table->foreignId('type_file_id')->constrained('type_files');


        });
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE template_files ADD file LONGBLOB");

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('file_template');
    }
};
