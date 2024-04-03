<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectTasks extends Model
{
    protected $fillable = [
        'task_id',
        'id',
        'project_id',
        'stage_number',
        'price',
        'date_start',
        'date_end',
        'duration',
    ];

    public function executors(): HasMany
    {
        return $this->hasMany(ProjectTaskExecutor::class);
    }

    public function project_inherited_tasks(): HasMany
    {
        return $this->hasMany(ProjectTaskIngerited::class, 'project_tasks_id', 'id');
    }

    public function other_project_tasks(): HasMany
    {
        return $this->hasMany(ProjectTaskIngerited::class, 'project_tasks_id', 'id');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
