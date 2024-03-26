<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GroupFacilities extends Model
{
    protected $fillable = [
        'name',
        'code',
        'subselection_facility_id',
    ];
    public function subselection_facility(): BelongsTo
    {
        return $this->belongsTo(SubselectionFacility::class);
    }

    public function facilities(): HasMany
    {
        return $this->hasMany(Facility::class, 'group_facility_id','id');
    }
}
