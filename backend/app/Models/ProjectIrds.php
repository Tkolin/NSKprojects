<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectIrds extends Pivot
{
    protected $table = 'project_irds';

    protected $fillable = [
        'id',
        'project_id',
        'ird_id',
        'stage_number',
        'application_project',
        'received_date',
        'is_broken',
        'is_viewed',
        'acceptance_date',
        
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id', 'id');
    }
    public function ird(): BelongsTo
    {
        return $this->belongsTo(InitialAuthorizationDocumentation::class, 'ird_id', 'id');
    }
}
