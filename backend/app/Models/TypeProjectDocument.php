<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TypeProjectDocument extends Model
{
    protected $fillable = [
        'code',
        'name',
        'group_id',
    ];

    public function group(): BelongsTo
    {
        return $this->belongsTo(GroupTypeProjectDocument::class);
    }
    public function template_content_type_project(): BelongsTo
    {
        return $this->belongsTo(TemplateIrdsTypeProjects::class);
    }
    public function template_stages_type_project(): BelongsTo
    {
        return $this->belongsTo(TemplateStagesTypeProjects::class);
    }


    public function project(): HasMany
    {
        return $this->hasMany(Project::class);
    }
    public function template_sections_reference(): HasMany
    {
        return $this->hasMany(TemplateSectionReference::class);
    }
}
