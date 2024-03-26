<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use function Laravel\Prompts\select;

class Facility extends Model
{
    protected $fillable = [
        'name',
        'type_id',
        'code',
        'group_facility_id',
    ];

    public function type_facility(): BelongsTo
    {
        return $this->belongsTo(TypeFacility::class);
    }
    public function group_facility(): BelongsTo
    {
        return $this->belongsTo(GroupFacilities::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(ProjectFacilities::class);
    }
}
