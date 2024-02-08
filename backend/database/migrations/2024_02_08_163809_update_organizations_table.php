<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->unsignedBigInteger('legal_form_id')->nullable()->change();
            $table->string('full_name')->nullable()->change();
            $table->unsignedBigInteger('address_legal_id')->nullable()->change();
            $table->string('office_number_legal')->nullable()->change();
            $table->unsignedBigInteger('address_mail_id')->nullable()->change();
            $table->string('office_number_mail')->nullable()->change();
            $table->string('phone_number')->nullable()->change();
            $table->string('fax_number')->nullable()->change();
            $table->string('email')->nullable()->change();
            $table->string('INN')->nullable()->change();
            $table->string('OGRN')->nullable()->change();
            $table->string('OKPO')->nullable()->change();
            $table->string('KPP')->nullable()->change();
            $table->unsignedBigInteger('BIK_id')->nullable()->change();
            $table->string('payment_account')->nullable()->change();
            $table->unsignedBigInteger('director_id')->nullable()->change();

            // Удаление и повторное добавление ограничений внешних ключей
            $table->dropForeign(['legal_form_id']);
            $table->foreign('legal_form_id')->references('id')->on('legal_forms')->onDelete('set null');

            $table->dropForeign(['address_legal_id']);
            $table->foreign('address_legal_id')->references('id')->on('addresses')->onDelete('set null');

            $table->dropForeign(['address_mail_id']);
            $table->foreign('address_mail_id')->references('id')->on('addresses')->onDelete('set null');

            $table->dropForeign(['BIK_id']);
            $table->foreign('BIK_id')->references('id')->on('biks')->onDelete('set null');

            $table->dropForeign(['director_id']);
            $table->foreign('director_id')->references('id')->on('persons')->onDelete('set null');
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
