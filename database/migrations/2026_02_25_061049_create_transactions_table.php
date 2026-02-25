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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            // Кто совершил операцию
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Тип операции: credit (начисление) или debit (списание)
            $table->enum('type', ['credit', 'debit']);
            
            $table->decimal('amount', 10, 2);
            $table->string('description');
            
            // Связь с услугой (если услуга удалена, поле станет NULL)
            $table->foreignId('service_id')->nullable()->constrained()->onDelete('set null');
            
            $table->timestamps();

            $table->index('user_id'); // Индекс для быстрого получения истории пользователя
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
