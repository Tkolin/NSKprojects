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
        Schema::table('template_stages_type_project', function (Blueprint $table) {
            $table->dropColumn(['application_to_project']);
            $table->dropColumn(['number']);;

            $table->dropForeign(["stages_is"]);
            $table->foreign('stages_is')->references('id')->on('stages');
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
