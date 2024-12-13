<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FacilitySubselection extends Model
{
    protected $fillable = [
        'name',
        'code',
        'facility_selection_id',
    ];
    public function facility_selection(): BelongsTo
    {
        return $this->belongsTo(FacilitySelection::class);
    }

    public function facility_group(): HasMany
    {
        return $this->hasMany(FacilityGroup::class);
    }
}
