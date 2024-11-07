<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectStage extends Pivot
{
    protected $table = 'project_stages';
    protected $primaryKey = null;
    public $incrementing = false;
    

    protected $fillable = [
        'project_id',
        'stage_id',
        'number',
        'offset',
        'progress',
        'date_start',
        'duration',
        'date_end',
        'percent',
        'price',
        'price_to_paid',
        
        'payment_file_id',
        'payment_date',

        'work_act_singing_file_id',
        'work_act_singing_date',
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
