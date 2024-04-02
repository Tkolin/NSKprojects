<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectTasks extends Model
{
    protected $fillable = [
        'project_executors_id',
        'task_id',
        'id',
        'task_id',
        'project_id',
        'inherited_task_id',
        'stage_number',
        'price',
        'date_start',
        'date_end',
        'duration',
    ];

    public function projects_executors()
    {
        return $this->belongsTo(ProjectExecutors::class);
    }

    public function inherited__project_tasks()
    {
        return $this->belongsTo(ProjectTasks::class);
    }

    public function other_project_tasks(): HasMany
    {
        return $this->hasMany(ProjectTasks::class);
    }

    public function tasks()
    {
        return $this->belongsTo(Task::class);
    }

    public function sub_tasks()
    {
        return $this->hasMany(ProjectTasks::class, 'inherited_task_id');
    }
}
