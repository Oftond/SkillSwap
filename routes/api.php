<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ServiceController;

// Публичные маршруты (Авторизация)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Защищенные маршруты (Требуют токен)
Route::middleware('auth:api')->group(function () {
    
    // Выход
    Route::post('/logout', [AuthController::class, 'logout']);

    // Пользователь
    Route::prefix('user')->group(function () {
        Route::get('/profile', [UserController::class, 'profile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
        Route::get('/services', [UserController::class, 'myServices']);
        Route::get('/transactions', [UserController::class, 'transactions']);
    });

    // Услуги
    Route::prefix('services')->group(function () {
        Route::get('/', [ServiceController::class, 'index']);       // Список с фильтрами
        Route::get('/{id}', [ServiceController::class, 'show']);   // Детали
        
        // Создание, обновление, удаление (требуется токен)
        Route::post('/', [ServiceController::class, 'store']);
        Route::put('/{id}', [ServiceController::class, 'update']);
        Route::delete('/{id}', [ServiceController::class, 'destroy']);
        
        // Покупка
        Route::post('/{id}/purchase', [ServiceController::class, 'purchase']);
    });
});