<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Service;
use App\Models\Transaction;

class UserController extends Controller
{
    public function __construct()
    {
        // $this->middleware('auth:api');
    }

    public function profile()
    {
        $user = Auth::user();
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'balance' => $user->balance,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            // Баланс обычно не меняют напрямую через профиль, только через транзакции
        ]);

        if ($request->has('name')) {
            $user->name = $request->name;
        }
        
        $user->save();

        return response()->json(['message' => 'Profile updated']);
    }

    public function myServices()
    {
        $user = Auth::user();
        $services = $user->services()->with('user:id,name')->get();
        
        // Форматируем вывод под ТЗ
        return response()->json($services->map(function($s) {
            return [
                'id' => $s->id,
                'title' => $s->title,
                'description' => $s->description,
                'price' => (float)$s->price,
                'category' => $s->category,
                'category_name' => $s->category_name,
                'user_id' => $s->user_id,
                'user' => $s->user,
                'created_at' => $s->created_at,
                'updated_at' => $s->updated_at,
            ];
        }));
    }

    public function transactions()
    {
        $user = Auth::user();
        return response()->json(
            $user->transactions()
                 ->orderBy('created_at', 'desc')
                 ->get(['id', 'user_id', 'type', 'amount', 'description', 'service_id', 'created_at'])
        );
    }
}