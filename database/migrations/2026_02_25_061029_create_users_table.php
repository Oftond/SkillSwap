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
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // Первичный ключ (в PG это bigserial)
            $table->string('name');
            $table->string('email')->unique(); // Уникальный email
            $table->string('password');
            $table->decimal('balance', 10, 2)->default(0); // Баланс коинов
            $table->rememberToken(); // Для функции "Запомнить меня" (опционально)
            $table->timestamps(); // Поля created_at и updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
