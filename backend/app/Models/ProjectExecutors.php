<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectExecutors extends Model
{
    protected $table = 'project_executors';
    protected $fillable = [
        'date_start',
        'date_end',
        'price',
        'project_id',
        'executor_id',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
    public function executor(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }
    public function taskExecutor(): HasMany
    {
        return $this->hasMany(ProjectExecutors::class);
    }
}
