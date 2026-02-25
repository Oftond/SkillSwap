<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'balance' => 0,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User registered',
            'token' => $token,
            'user_id' => $user->id
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        // Скрываем лишние поля, оставляем только нужные по ТЗ
        $userData = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'balance' => $user->balance,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $userData
        ]);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Logged out successfully']);
    }
}