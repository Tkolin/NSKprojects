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
        Schema::create('selection_facilities', function (Blueprint $table) {
            $table->id();
            $table->string("name")->nullable();
            $table->timestamps();
        });
        Schema::create('subselection_facilities', function (Blueprint $table) {
            $table->id();
            $table->string("name")->nullable();

            $table->unsignedBigInteger('selection_facility_id')->nullable();
            $table->foreign('selection_facility_id')->references('id')->on('selection_facilities')->onDelete('set null');

            $table->timestamps();
        });
        Schema::create('group_facilities', function (Blueprint $table) {
            $table->id();
            $table->string("name")->nullable();

            $table->unsignedBigInteger('subselection_facility_id')->nullable();
            $table->foreign('subselection_facility_id')->references('id')->on('subselection_facilities')->onDelete('set null');
            $table->timestamps();
        });
        Schema::table('facilities', function (Blueprint $table) {
            $table->unsignedBigInteger('group_facility_id')->nullable();
            $table->foreign('group_facility_id')->references('id')->on('group_facilities')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('selection_facility_tables');
    }
};
