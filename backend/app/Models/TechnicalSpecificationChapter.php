<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TechnicalSpecificationChapter extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'name',
         'content',
        'variables_in_content',
    ];

    protected $casts = [
        'content' => 'array', // Преобразование JSON в массив
    ];
    protected $table = 'technical_specification_chapters';
}
