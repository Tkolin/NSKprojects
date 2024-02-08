<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('legal_form_id')->constrained('legal_forms');
            $table->string('name');
            $table->string('full_name');
            $table->foreignId('address_legal_id')->constrained('addresses');
            $table->string('office_number_legal');
            $table->foreignId('address_mail_id')->constrained('addresses');
            $table->string('office_number_mail');
            $table->string('phone_number');
            $table->string('fax_number');
            $table->string('email');
            $table->string('INN');
            $table->string('OGRN');
            $table->string('OKPO');
            $table->string('KPP');
            $table->foreignId('BIK_id')->constrained('biks');
            $table->string('payment_account');
            $table->foreignId('director_id')->constrained('persons');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organizations');
    }
};
