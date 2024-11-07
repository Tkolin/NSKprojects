<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Delay extends Model
{
    protected $fillable = [
        'id',
        'project_id',
        'date_start',
        'date_end',
        'duration',
        'description',
        'delay_type_key',
        'provider',
        'updated_at',
        'created_at',
    ];

    public function delay_project_tasks(): HasMany
    {
        return $this->hasMany(
            DelayProjectTask::class
        );
    }

    public function delay_type(): BelongsTo
    {
        return $this->belongsTo(
            DelayType::class, "delay_type_key","key"
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
