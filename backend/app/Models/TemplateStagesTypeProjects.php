<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateStagesTypeProjects extends Model
{
    protected $table = 'template_stages_type_project';
    public function type_project(): BelongsTo
    {
        return $this->belongsTo(TypeProjectDocumentPost::class);
    }
    public function stage(): BelongsTo
    {
        return $this->belongsTo(Stage::class);
    }
}
