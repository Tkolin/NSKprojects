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
        Schema::table('projects', function (Blueprint $table) {
//            $table->dropColumn("kp_file_id");
//            $table->dropColumn("contract_file_id");
//            $table->unsignedBigInteger('contract_file_id')->nullable();
//            $table->unsignedBigInteger('kp_file_id')->nullable();
            $table->foreign('contract_file_id')->references('id')->on('file')->onDelete('set null');
            $table->foreign('kp_file_id')->references('id')->on('file')->onDelete('set null');
            $table->dropColumn('date_create');
            $table->string('date_start')->nullable();

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
