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
        Schema::dropIfExists('project_chapters_technical_specification');//+

        Schema::dropIfExists('machinery_excavators');//+
        Schema::dropIfExists('machinery_excavators_bucket_type');//+
        Schema::dropIfExists('machinery_manufacturer');//+

        Schema::dropIfExists('education_persons');//+
        Schema::dropIfExists('educations');//+
        Schema::dropIfExists('type_education_documents');//+
        Schema::dropIfExists('education_qualifications');//+
        Schema::dropIfExists('educational_institutions');//+
        Schema::dropIfExists('education_specializations');//+

        Schema::dropIfExists('project_sections_reference');//+
        Schema::dropIfExists('sections_reference');//+
        Schema::dropIfExists('references');//+

        Schema::dropIfExists('project_delegations');//+
        Schema::dropIfExists('project_facilities');//+
        Schema::dropIfExists('project_fenrirs');//+
        Schema::dropIfExists('project_irds');//+
        Schema::dropIfExists('project_stages');//+

        Schema::create('project_delegations', function (Blueprint $table) {
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('delegation_id');

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('delegation_id')->references('id')->on('contacts')->onDelete('cascade');
            $table->timestamps();
        });//+
        Schema::create('project_facilities', function (Blueprint $table) {
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('facility_id'); // Use string instead of foreignId

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('facility_id')->references('id')->on('facilities')->onDelete('cascade');
            $table->timestamps();
        });//+
        Schema::create('project_fenrirs', function (Blueprint $table) {
            $table->unsignedBigInteger('fenrir_id');
            $table->unsignedBigInteger('project_id'); // Use string instead of foreignId

            $table->foreign('fenrir_id')->references('id')->on('fenrirs')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->timestamps();
        });//+
        Schema::create('project_irds', function (Blueprint $table) {
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('ird_id');

            $table->date('received_date')->nullable();
            $table->integer('application_project')->nullable();
            $table->integer('stage_number')->nullable();

            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->foreign('ird_id')->references('id')->on('initial_authorization_documentations')->onDelete('cascade');
            $table->timestamps();
        });//+

        Schema::create('project_stages', function (Blueprint $table) {
            $table->integer('number');
            $table->unsignedBigInteger('project_id');
            $table->unsignedBigInteger('stage_id');
            $table->integer('duration')->default(0);
            $table->date('date_start')->nullable();
            $table->date('date_end')->nullable();
            $table->decimal('price', 12, 2)->default(0.00);
            $table->integer('percent')->default(0);
            $table->decimal('price_to_paid', 12, 2)->default(0.00);

            $table->date('payment_deadline')->nullable();

            $table->foreign('stage_id')->references('id')->on('stages')->onDelete('cascade');
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->timestamps();
        });//+
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
