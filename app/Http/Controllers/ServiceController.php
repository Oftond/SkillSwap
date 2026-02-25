<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    // GET /api/services (Публичный + фильтры)
    public function index(Request $request)
    {
        $query = Service::with('user:id,name');

        // Фильтры
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }
        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', $search)
                  ->orWhere('description', 'like', $search);
            });
        }
        if ($request->filled('minPrice')) {
            $query->where('price', '>=', $request->minPrice);
        }
        if ($request->filled('maxPrice')) {
            $query->where('price', '<=', $request->maxPrice);
        }

        // Сортировка
        switch ($request->sort) {
            case 'oldest': $query->orderBy('created_at', 'asc'); break;
            case 'price_asc': $query->orderBy('price', 'asc'); break;
            case 'price_desc': $query->orderBy('price', 'desc'); break;
            default: $query->orderBy('created_at', 'desc'); // newest
        }

        // Пагинация
        $perPage = $request->get('per_page', 10);
        $services = $query->paginate($perPage);

        // Форматирование ответа
        $formatted = $services->getCollection()->map(function($s) {
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
        });

        return response()->json([
            'data' => $formatted,
            'page' => $services->currentPage(),
            'per_page' => $services->perPage(),
            'total' => $services->total(),
        ]);
    }

    // GET /api/services/{id}
    public function show($id)
    {
        $service = Service::with('user:id,name')->findOrFail($id);
        
        return response()->json([
            'id' => $service->id,
            'title' => $service->title,
            'description' => $service->description,
            'price' => (float)$service->price,
            'category' => $service->category,
            'category_name' => $service->category_name,
            'user_id' => $service->user_id,
            'user' => $service->user,
            'created_at' => $service->created_at,
            'updated_at' => $service->updated_at,
        ]);
    }

    // POST /api/services (Требуется токен)
    public function store(Request $request)
    {
        // $this->middleware('auth:api');
        $user = Auth::user();

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|in:education,music,sports,languages,programming,art,other',
        ]);

        $service = $user->services()->create($request->all());

        return response()->json([
            'message' => 'Service created',
            'id' => $service->id
        ], 201);
    }

    // PUT /api/services/{id} (Только владелец)
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $service = Service::findOrFail($id);

        if ($service->user_id !== $user->id) {
            return response()->json(['error' => 'Forbidden: Only owner can modify'], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'category' => 'sometimes|in:education,music,sports,languages,programming,art,other',
        ]);

        $service->update($request->only(['title', 'description', 'price', 'category']));

        return response()->json(['message' => 'Service updated']);
    }

    // DELETE /api/services/{id} (Только владелец)
    public function destroy($id)
    {
        $user = Auth::user();
        $service = Service::findOrFail($id);

        if ($service->user_id !== $user->id) {
            return response()->json(['error' => 'Forbidden: Only owner can delete'], 403);
        }

        $service->delete();
        return response()->json(['message' => 'Service deleted']);
    }

    // POST /api/services/{id}/purchase
    public function purchase($id)
    {
        $buyer = Auth::user();
        $service = Service::findOrFail($id);

        if ($service->user_id === $buyer->id) {
            return response()->json(['error' => 'Cannot buy your own service'], 400);
        }

        return DB::transaction(function () use ($buyer, $service) {
            // Проверка баланса
            if ($buyer->balance < $service->price) {
                throw new \Exception("Insufficient funds", 400);
            }

            // Списываем у покупателя
            $buyer->decrement('balance', $service->price);

            // Начисляем продавцу
            $seller = User::find($service->user_id);
            $seller->increment('balance', $service->price);

            // Транзакция покупателя (debit)
            Transaction::create([
                'user_id' => $buyer->id,
                'type' => 'debit',
                'amount' => $service->price,
                'description' => 'Покупка услуги: ' . $service->title,
                'service_id' => $service->id,
            ]);

            // Транзакция продавца (credit)
            Transaction::create([
                'user_id' => $seller->id,
                'type' => 'credit',
                'amount' => $service->price,
                'description' => 'Продажа услуги: ' . $service->title,
                'service_id' => $service->id,
            ]);

            return response()->json([
                'message' => 'Purchase successful',
                'new_balance' => $buyer->balance
            ]);
        });
    }
}