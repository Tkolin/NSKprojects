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
        Schema::create('technical_specifications', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->timestamps();
        });



        Schema::table("group_type_project_documents",function (Blueprint $table) {
            $table->unsignedBigInteger('technical_specification_id')->nullable();
            $table->foreign('technical_specification_id')->references('id')->on('technical_specifications')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('technical_specification');
    }
};
