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
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            // Внешний ключ на таблицу users. При удалении пользователя удаляются и его услуги (cascade).
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->string('title');
            $table->text('description');
            $table->decimal('price', 10, 2);
            
            // Категории согласно ТЗ
            $table->enum('category', [
                'education', 
                'music', 
                'sports', 
                'languages', 
                'programming', 
                'art', 
                'other'
            ]);

            $table->timestamps();
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
