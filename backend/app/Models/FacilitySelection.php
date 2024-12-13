<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FacilitySelection extends Model
{
    protected $fillable = [
        'name',
        'code',
    ];
    public function facility_subselection(): HasMany
    {
        return $this->hasMany(FacilitySubselection::class);
    }
}
