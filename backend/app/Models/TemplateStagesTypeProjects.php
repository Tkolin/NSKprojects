<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateStagesTypeProjects extends Model
{
    protected $table = 'template_stages_type_project';

    protected $fillable = [
        'project_type_id',
        'stage_id',
        'date_start',
        'date_end',
        'percentage',
        'stage_number',
    ];
    public function type_project(): BelongsTo
    {
        return $this->belongsTo(TypeProjectDocument::class);
    }
    public function stage(): BelongsTo
    {
        return $this->belongsTo(Stage::class, 'stage_id');
    }
}

