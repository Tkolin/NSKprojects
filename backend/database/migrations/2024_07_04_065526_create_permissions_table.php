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
        // migration for permissions table
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

// pivot table for users and roles
        Schema::create('role_user', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained("users")->nullable();
            $table->foreignId('role_id')->constrained("roles")->nullable();
            $table->timestamps();
        });

// pivot table for roles and permissions
        Schema::create('permission_role', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained("roles")->nullable();
            $table->foreignId('permission_id')->constrained("permissions")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');

        Schema::dropIfExists('role_user');

        Schema::dropIfExists('permission_role');

    }
};
