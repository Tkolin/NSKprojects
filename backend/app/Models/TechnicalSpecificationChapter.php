<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TechnicalSpecificationChapter extends Model
{
    protected $table = 'technical_specification_chapters';

    protected $fillable = [
        'name',
        'content',
        'created_at',
        'updated_at',
    ];

    /**
     * Связь "один ко многим" с TechnicalSpecificationChapterValue.
     */
    public function values(): HasMany
    {
        return $this->hasMany(TechnicalSpecificationChapterValue::class, 'chapter_id');
    }
}
