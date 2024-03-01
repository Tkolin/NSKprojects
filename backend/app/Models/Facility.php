<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Facility extends Model
{
    protected $fillable = [
        'name',
        'type_id',
    ];
    public function type_facility(): BelongsTo
    {
        return $this->belongsTo(TypeFacility::class, 'type_id');
    }
    public function project(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
