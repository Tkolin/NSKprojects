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
        Schema::table('projects', function (Blueprint $table) {
            $table->string('number')->nullable()->change();
            $table->string('name')->nullable()->change();
            $table->unsignedBigInteger('organization_customer_id')->nullable()->change();
            $table->unsignedBigInteger('type_project_document_id')->nullable()->change();
            $table->unsignedBigInteger('facility_id')->nullable()->change();
            $table->date('date_signing')->nullable()->change();
            $table->unsignedBigInteger('IAD_id')->nullable()->change();
            $table->integer('duration')->nullable()->change();
            $table->date('date_end')->nullable()->change();
            $table->unsignedBigInteger('status_id')->nullable()->change();
            $table->date('date_completion')->nullable()->change();

            // Удаление и повторное добавление ограничений внешних ключей
            $table->dropForeign(['organization_customer_id']);
            $table->foreign('organization_customer_id')->references('id')->on('organizations')->onDelete('set null');

            $table->dropForeign(['type_project_document_id']);
            $table->foreign('type_project_document_id')->references('id')->on('type_project_documents')->onDelete('set null');

            $table->dropForeign(['facility_id']);
            $table->foreign('facility_id')->references('id')->on('facilities')->onDelete('set null');

            $table->dropForeign(['IAD_id']);
            $table->foreign('IAD_id')->references('id')->on('initial_authorization_documentations')->onDelete('set null');

            $table->dropForeign(['status_id']);
            $table->foreign('status_id')->references('id')->on('project_statuses')->onDelete('set null');
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
