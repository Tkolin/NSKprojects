<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReferenceModel extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'name',
        'description',
        'content',
    ];

    // Преобразуем поле 'content' в массив автоматически
    protected $casts = [
        'content' => 'array', // Преобразование JSON в массив
    ];
    protected $table = 'references';
}
