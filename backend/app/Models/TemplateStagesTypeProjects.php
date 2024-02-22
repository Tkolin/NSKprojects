<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateStagesTypeProjects extends Model
{
    protected $table = 'template_stages_type_project';

    protected $fillable = [
        'project_type_id',
        'stages_is',
        'date_start',
        'date_end',
        'percentage',
        'number',
    ];
    public function type_project(): BelongsTo
    {
        return $this->belongsTo(TypeProjectDocument::class);
    }
    public function stage(): BelongsTo
    {
        return $this->belongsTo(Stage::class);
    }
}
