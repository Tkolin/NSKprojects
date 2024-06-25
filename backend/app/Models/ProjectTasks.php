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
        'project_task_inherited_id',
        'stage_number',
        'price',
        'date_start',
        'date_end',
        'duration',
        'executor_id',
    ];

    public function executors(): HasMany
    {
        return $this->hasMany(ProjectTaskExecutor::class, "project_tasks_id");
    }
    public function executor(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }
    public function inherited_task_ids()
    {
        return $this->hasMany(ProjectTasksInherited::class, 'project_task_id')->select('project_task_id','project_inherited_task_id');
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }
}
