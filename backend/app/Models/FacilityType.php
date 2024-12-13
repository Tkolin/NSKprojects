<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use function Laravel\Prompts\select;

class FacilityType extends Model
{
    protected $fillable = [
        'name',
        'type_id',
        'code',
        'facility_group_id',
    ];

    // public function facility_type(): BelongsTo
    // {
    //     return $this->belongsTo(TypeFacility::class);
    // }
    public function facility_group(): BelongsTo
    {
        return $this->belongsTo(FacilityGroup::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(ProjectFacilities::class);
    }
}
