<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function profile()
    {
        return response()->json([
            'data' => auth()->user(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only('name', 'email'));

        return response()->json([
            'data' => $user,
        ]);
    }

    public function userServices()
    {
        $services = auth()->user()->services()->latest()->get();
        return response()->json([
            'data' => $services,
        ]);
    }

    public function userTransactions()
    {
        $transactions = auth()->user()->transactions()
            ->with('service')
            ->latest()
            ->get();

        return response()->json([
            'data' => $transactions,
        ]);
    }
}