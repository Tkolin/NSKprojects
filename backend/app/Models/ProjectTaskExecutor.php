<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectTaskExecutor extends Model
{
    protected $table = 'project_tasks_executors';
    protected $fillable = [
        "id",
        "project_tasks_id",
        "executor_id",
        "date_start",
        "duration",
        "description",
        "date_end",
        "price"
    ];
    public function project_task(): BelongsTo
    {
        return $this->belongsTo(ProjectTasks::class,"project_tasks_id");
    }
    public function executor(): BelongsTo
    {
        return $this->belongsTo(Person::class,"executor_id");
    }
}
