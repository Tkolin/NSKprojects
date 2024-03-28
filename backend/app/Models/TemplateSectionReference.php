<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateSectionReference extends Model
{
    protected $fillable = [
        'project_type_id',
        'section_reference_id',
        'values'
    ];
    public function project(): BelongsTo
    {
        return $this->belongsTo(TypeProjectDocument::class);
    }
    public function section_reference(): BelongsTo
    {
        return $this->belongsTo(SectionReference::class);
    }
}
