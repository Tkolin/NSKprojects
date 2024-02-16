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
        Schema::table('persons', function (Blueprint $table) {
            $table->string('SHILS')->nullable()->change();
            $table->string('INN')->nullable()->change();
            $table->string('payment_account')->nullable()->change();
            $table->string('phone_number')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->string('email_sibnipi')->nullable()->change();
            $table->unsignedBigInteger('passport_id')->nullable()->change();
            $table->unsignedBigInteger('bank_id')->nullable()->change();
            $table->unsignedBigInteger('bik_id')->nullable()->change();

            $table->dropForeign(['passport_id']);
            $table->foreign('passport_id')->references('id')->on('passports')->onDelete('set null');

            $table->dropForeign(['bank_id']);
            $table->foreign('bank_id')->references('id')->on('banks')->onDelete('set null');

            $table->dropForeign(['bik_id']);
            $table->foreign('bik_id')->references('id')->on('biks')->onDelete('set null');

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
