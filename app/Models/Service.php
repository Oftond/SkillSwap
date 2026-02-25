<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'price',
        'category',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    // Helper для имени категории (можно вынести в сервис, но для MVP ок тут)
    public function getCategoryNameAttribute()
    {
        $map = [
            'education' => 'Образование',
            'music' => 'Музыка',
            'sports' => 'Спорт',
            'languages' => 'Языки',
            'programming' => 'Программирование',
            'art' => 'Искусство',
            'other' => 'Другое'
        ];
        return $map[$this->category] ?? 'Неизвестно';
    }
}