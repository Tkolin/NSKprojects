<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateIrdsTypeProjects extends Model
{
    protected $table = 'template_irds_type_project';

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
    public function ird(): BelongsTo
    {
        return $this->belongsTo(InitialAuthorizationDocumentation::class);
    }
}
