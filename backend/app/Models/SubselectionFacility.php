<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubselectionFacility extends Model
{
    protected $fillable = [
        'name',
        'code',
        'selection_facility_id',
    ];
    public function selection_facility(): BelongsTo
    {
        return $this->belongsTo(SelectionFacility::class);
    }

    public function group_facility(): HasMany
    {
        return $this->hasMany(GroupFacilities::class, 'subselection_facility_id','id');
    }
}
