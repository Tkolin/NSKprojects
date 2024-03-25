<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectStage extends Model
{
    protected $fillable = [
        'project_id',
        'stage_id',
        'number',
        'progress',
        'date_start',
        'duration',
        'date_end',
        'percent',
        'price',
        'price_to_paid',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
    public function stage(): BelongsTo
    {
        return $this->belongsTo(Stage::class);
    }
}
