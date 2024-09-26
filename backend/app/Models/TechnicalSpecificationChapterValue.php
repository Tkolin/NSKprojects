<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TechnicalSpecificationChapterValue extends Model
{
    protected $table = 'technical_specification_chapter_values';

    protected $fillable = [
        'chapter_id',
        'name',
        'description',
        'type',
        'defaultValue',
        'created_at',
        'updated_at',
    ];

    /**
     * Связь "многие к одному" с TechnicalSpecificationChapter
     */
    public function chapter(): BelongsTo
    {
        return $this->belongsTo(TechnicalSpecificationChapter::class, 'chapter_id');
    }

    /**
     * Связь "многие ко многим" с ReferenceModel через technical_specification_chapter_value_reference
     */
    public function references(): BelongsToMany
    {
        return $this->belongsToMany(
            ReferenceModel::class,
            'technical_specification_chapter_value_reference',
            'technical_specification_chapter_value_id',
            'reference_id'
        );
    }
}
