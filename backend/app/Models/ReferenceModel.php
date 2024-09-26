<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
    public function technicalSpecificationChapterValues(): BelongsToMany
    {
        return $this->belongsToMany(
            TechnicalSpecificationChapterValue::class,
            'technical_specification_chapter_value_reference',
            'reference_id',
            'technical_specification_chapter_value_id'
        );
    }
}
