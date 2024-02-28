<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectTasks extends Model
{
    protected $fillable = [
        'project_executors_id',
        'task_id',
    ];

    public function projects_executors(): BelongsTo
    {
        return $this->belongsTo(ProjectExecutors::class);
    }
    public function tasks(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
