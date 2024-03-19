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
        Schema::table('selection_facilities', function (Blueprint $table) {
            $table->integer("code")->nullable();
        });
        Schema::table('subselection_facilities', function (Blueprint $table) {
            $table->integer("code")->nullable();
        });
        Schema::table('group_facilities', function (Blueprint $table) {
            $table->integer("code")->nullable();
        });
        Schema::table('facilities', function (Blueprint $table) {
            $table->integer("code")->nullable();
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
