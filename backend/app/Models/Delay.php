<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Delay extends Model
{
    protected $fillable = [
        'id',
        'project_id',
        'date_start',
        'date_end',
        'duration',
        'description',
        'delay_type',
        'provider'
    ];

    public function delay_project_tasks(): HasMany
    {
        return $this->hasMany(
            DelayProjectTask::class
        );
    }
    public function project_tasks(): HasManyThrough
    {
        return $this->hasManyThrough(
            ProjectTasks::class,
            DelayProjectTask::class,
            'delay_id',
            'id',
            'id',
            'project_task_id'
        );
    }
    public function project(): BelongsTo
    {
        return $this->belongsTo(
            Project::class
        );
    }
}
