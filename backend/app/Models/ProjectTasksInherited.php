<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectTasksInherited extends Model
{
    protected $table = 'project_tasks_inherited';
    protected $fillable = [
        "id",
        "project_task_id",
        "project_inherited_task_id",
    ];
}
