<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('project_files', function (Blueprint $table) {
            $table->enum('type', ["KP", "CONTRACT", "CONTRACT_STAMP", "OTHER"]);
            $table->dropForeign(['type_id']);
            $table->dropColumn('type_id');
        });
        Schema::dropIfExists("project_type_files");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
