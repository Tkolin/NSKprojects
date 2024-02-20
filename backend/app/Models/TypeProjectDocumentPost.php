<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TypeProjectDocumentPost extends Model
{
    protected $fillable = [
        'code-post',
        'name-post',
    ];
    public function type_project_id(): BelongsTo
    {
        return $this->belongsTo(TypeProjectDocumentPost::class);
    }
    public function template_content_type_project(): HasMany
    {
        return $this->belongsTo(TemplateIrdsTypeProjects::class);
    }
    public function template_stages_type_project(): HasMany
    {
        return $this->belongsTo(InitialAuthorizationDocumentation::class);
    }

    public function template_irds_type_project(): HasMany
    {
        return $this->belongsTo(TemplateIrdsTypeProjects::class);
    }
}
