<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::with('user');
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        if ($request->has('minPrice') && $request->minPrice !== '') {
            $query->where('price', '>=', $request->minPrice);
        }
        if ($request->has('maxPrice') && $request->maxPrice !== '') {
            $query->where('price', '<=', $request->maxPrice);
        }
        switch ($request->get('sort', 'newest')) {
            case 'oldest':
                $query->oldest();
                break;
            case 'price_asc':
                $query->orderBy('price');
                break;
            case 'price_desc':
                $query->orderByDesc('price');
                break;
            default:
                $query->latest();
                break;
        }

        $services = $query->paginate(12);

        return response()->json([
            'data' => $services->items(),
            'meta' => [
                'current_page' => $services->currentPage(),
                'last_page' => $services->lastPage(),
                'per_page' => $services->perPage(),
                'total' => $services->total(),
            ],
        ]);
    }

    public function show(Service $service)
    {
        return response()->json([
            'data' => $service->load('user'),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|integer|min:1',
            'category' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $service = auth()->user()->services()->create($request->only(
            'title', 'description', 'price', 'category'
        ));

        return response()->json([
            'data' => $service,
        ], 201);
    }

    public function update(Request $request, Service $service)
    {
        if ($service->user_id !== auth()->id()) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|integer|min:1',
            'category' => 'sometimes|required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $service->update($request->only(
            'title', 'description', 'price', 'category'
        ));

        return response()->json([
            'data' => $service,
        ]);
    }

    public function destroy(Service $service)
    {
        if ($service->user_id !== auth()->id()) {
            return response()->json(['message' => 'Доступ запрещен'], 403);
        }

        $service->delete();
        return response()->json(['message' => 'Услуга удалена']);
    }

    public function purchase(Service $service)
    {
        $user = auth()->user();

        if ($user->id === $service->user_id) {
            return response()->json(['message' => 'Нельзя купить свою услугу'], 400);
        }

        if ($user->balance < $service->price) {
            return response()->json(['message' => 'Недостаточно средств'], 400);
        }

        DB::transaction(function () use ($user, $service) {ce->price;
            $user->save();

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'debit',
                'amount' => $service->price,
                'description' => "Покупка услуги: {$service->title}",
                'service_id' => $service->id,
            ]);

            $service->user->balance += $service->price;
            $service->user->save();

            Transaction::create([
                'user_id' => $service->user_id,
                'type' => 'credit',
                'amount' => $service->price,
                'description' => "Продажа услуги: {$service->title}",
                'service_id' => $service->id,
            ]);
        });

        return response()->json(['message' => 'Услуга успешно приобретена']);
    }
}