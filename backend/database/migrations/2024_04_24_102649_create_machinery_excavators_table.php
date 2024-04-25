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
        Schema::create('machinery_excavators_bucket_type', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('machinery_excavators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('manufacturer_id')->constrained('machinery_manufacturer');

            $table->string('model');
            $table->float('bucket_capacity')->nullable();
            $table->float('digging_depth_max')->nullable();
            $table->float('digging_height_max')->nullable();
            $table->float('unloading_height_max')->nullable();
            $table->float('digging_radius_stationary_max')->nullable();
            $table->float('digging_radius_max')->nullable();
            $table->float('unloading_radius_max')->nullable();
            $table->float('cycle_duration')->nullable();
            $table->float('excavator_width')->nullable();
            $table->float('excavator_weight')->nullable();
            $table->float('engine_power')->nullable();
            $table->foreignId('bucket_type_id')->constrained('machinery_excavators_bucket_type');


            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('machinery_excavators');
    }
};
