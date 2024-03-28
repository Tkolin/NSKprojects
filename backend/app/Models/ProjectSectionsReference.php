<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectSectionsReference extends Model
{
    protected $fillable = [
        'project_id',
        'section_reference_id',
        'values'
    ];
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
    public function section_reference(): BelongsTo
    {
        return $this->belongsTo(SectionReference::class);
    }
}
