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
        Schema::create('persons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('passport_id')->constrained('passports');
            $table->string('SHILS');
            $table->string('INN');
            $table->string('payment_account');
            $table->string('phone_number');
            $table->string('email');
            $table->string('email_sibnipi');
            $table->foreignId('bank_id')->constrained('banks');
            $table->foreignId('bik_id')->constrained('biks');
            $table->foreignId('note_id')->constrained('notes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('persons');
    }
};
