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
    ];


    public function template_content_type_project(): HasMany
    {
        return $this->belongsTo(TemplateIrdsTypeProjects::class);
    }
    public function template_stages_type_project(): HasMany
    {
        return $this->belongsTo(TemplateStagesTypeProjects::class);
    }

    public function template_contents_type_project(): HasMany
    {
        return $this->belongsTo(TemplateContentTypeProjects::class);
    }

}
