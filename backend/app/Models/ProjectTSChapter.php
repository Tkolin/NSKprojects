<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectTSChapter extends Model
{
    protected $table = 'project_ts_chapters';

    protected $fillable = [
        'id',
        'project_id',
        'ts_chapter_id'
    ];
    public function values(): HasMany
    {
        return $this->hasMany(ProjectTSChapterValue::class, 'project_ts_chapter');
    }
    public function ts_chapter(): BelongTo
    {
        return $this->hasMany(TechnicalSpecificationChapter::class);
    }
}
