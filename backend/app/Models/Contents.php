<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contents extends Model
{
    protected $fillable = [
        'number'
    ];

    public function projectContents(): BelongsTo
    {
        return $this->belongsTo(ProjectContents::class);
    }
    public function template_content_type_project(): BelongsTo
    {
        return $this->belongsTo(TemplateContentTypeProjects::class);
    }
}
