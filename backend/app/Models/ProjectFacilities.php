<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectFacilities extends Model
{
    protected $fillable = [
        'project_id',
        'facility_id',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
    public function facilitys(): BelongsTo
    {
        return $this->belongsTo(FacilityType::class);
    }
}
