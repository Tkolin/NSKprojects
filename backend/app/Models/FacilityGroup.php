<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FacilityGroup extends Model
{
    protected $fillable = [
        'name',
        'code',
        'facility_subselection_id',
    ];
    public function facility_subselection(): BelongsTo
    {
        return $this->belongsTo(FacilitySubselection::class);
    }

    public function facilities(): HasMany
    {
        return $this->hasMany(FacilityType::class);
    }
}
