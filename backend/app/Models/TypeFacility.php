<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TypeFacility extends Model
{
    protected $fillable = [
        'name',
    ];
    public function facilitys(): HasMany
    {
        return $this->hasMany(FacilityType::class);
    }
}
