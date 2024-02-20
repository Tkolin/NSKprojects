<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateContentTypeProjects extends Model
{
    protected $table = 'template_content_type_project';
    protected $fillable = [
        'project_type_id',
        'ird_id',
        'stage_number',
        'application_to_project',
    ];
    public function type_project(): BelongsTo
    {
        return $this->belongsTo(TypeProjectDocument::class);
    }
    public function content(): BelongsTo
    {
        return $this->belongsTo(Contents::class);
    }
}
