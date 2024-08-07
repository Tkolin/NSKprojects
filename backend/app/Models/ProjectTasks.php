<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        'offset',
        'executor_id',
    ];

    public function executor_orders(): BelongsToMany
    {
        return $this->belongsToMany(ExecutorOrder::class, 'executor_order_task', 'project_task_id', 'executor_order_id');
    }
    public function executor(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }

//    public function executor_orders(): HasMany
//    {
//        return $this->hasMany(ExecutorOrder::class, 'project_id', 'id');
//    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'task_id');
    }


    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
