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
        Schema::table('passports', function (Blueprint $table) {
            $table->string('firstname')->nullable()->change();
            $table->string('lastname')->nullable()->change();
            $table->string('patronymic')->nullable()->change();
            $table->string('serial')->nullable()->change();
            $table->string('number')->nullable()->change();
            $table->unsignedBigInteger('passport_place_issue_id')->nullable()->change();
            $table->date('birth_date')->nullable()->change();
            $table->date('date')->nullable()->change();

            $table->dropForeign(['passport_place_issue_id']);
            $table->foreign('passport_place_issue_id')->references('id')->on('passport_place_issues')->onDelete('set null');
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
