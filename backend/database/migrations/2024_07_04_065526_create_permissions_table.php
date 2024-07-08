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
        Schema::dropIfExists('roles');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('permission_role');

        Schema::create('permissions', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->string('name_key')->primary();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('roles', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->string('name_key')->primary();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('role_user', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->string('role_id'); // Use string instead of foreignId
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('role_id')->references('name_key')->on('roles')->onDelete('cascade');
        });

        // pivot table for roles and permissions
        Schema::create('permission_role', function (Blueprint $table) {
            $table->string('role_id'); // Use string instead of foreignId
            $table->string('permission_id'); // Use string instead of foreignId
            $table->timestamps();

            $table->foreign('role_id')->references('name_key')->on('roles')->onDelete('cascade');
            $table->foreign('permission_id')->references('name_key')->on('permissions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('role_user');

        Schema::dropIfExists('permissions');



    }
};
