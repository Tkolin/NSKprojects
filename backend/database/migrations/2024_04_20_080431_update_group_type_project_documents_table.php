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
        Schema::table('group_type_project_documents', function (Blueprint $table) {
            $table->dropForeign("group_type_project_documents_technical_specification_id_foreign");
            $table->foreign('technical_specification_id')
                ->references('id')
                ->on('type_technical_specifications');
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
