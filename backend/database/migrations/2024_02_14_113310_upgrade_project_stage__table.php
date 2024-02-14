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
        Schema::table('project_stages', function (Blueprint $table) {
            $table->dropColumn('progress');
            $table->date('date_end')->nullable();
            $table->decimal('price', 12, 2)->nullable();
            $table->decimal('price_to_paid', 12, 2)->nullable();
            $table->decimal('paid_sum', 12, 2)->nullable();
            $table->date('payment_deadline')->nullable();
            $table->dropColumn('duration');
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
