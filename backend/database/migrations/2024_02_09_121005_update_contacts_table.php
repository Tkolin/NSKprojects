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
        Schema::table('contacts', function (Blueprint $table) {
            $table->string('last_name')->nullable()->change();
            $table->string('mobile_phone')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->string('sibnipi_email')->nullable()->change();
            $table->unsignedBigInteger('position_id')->nullable()->change();
            $table->unsignedBigInteger('organization_id')->nullable()->after('position_id');

            $table->dropForeign(['position_id']);
            $table->foreign('position_id')->references('id')->on('positions')->onDelete('set null');
            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('set null');
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
