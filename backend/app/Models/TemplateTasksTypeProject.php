<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TemplateTasksTypeProject extends Model
{
    protected $table = 'template_tasks_type_project';

    protected $fillable = [
        'project_type_id',
        'task_id',
        'inherited_task_id',
        'stage_number',
    ];

    public function type_project(): BelongsTo
    {
        return $this->belongsTo(TypeProjectDocument::class, 'project_type_id');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }

    public function inheritedTask(): BelongsTo
    {
        return $this->belongsTo(TemplateTasksTypeProject::class, 'inherited_task_id');
    }
}

