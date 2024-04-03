<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectTaskIngerited extends Model
{
    protected $table = 'project_tasks_inherited';
    protected $fillable = [
        "id",
        "project_tasks_id",
        "project_inherited_task_id",
    ];

    public function project_tasks(): BelongsTo
    {
        return $this->belongsTo(ProjectTasks::class, 'project_tasks_id', 'id');
    }

    public function project_inherited_task(): BelongsTo
    {
        return $this->belongsTo(ProjectTasks::class, 'project_inherited_task_id', 'id');
    }
}
