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
        Schema::table('organizations',function (Blueprint $table) {

            $table->dropForeign('organizations_address_legal_id_foreign');
            $table->dropForeign('organizations_address_mail_id_foreign');

            $table->dropColumn('address_legal_id');
            $table->dropColumn('address_mail_id');

            $table->text('address_legal')->nullable();
            $table->text('address_mail')->nullable();
        });
        Schema::drop('addresses');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
