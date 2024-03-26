<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SelectionFacility extends Model
{
    protected $fillable = [
        'name',
        'code',
    ];
    public function subselection_facility(): HasMany
    {
        return $this->hasMany(SubselectionFacility::class, 'selection_facility_id', 'id');
    }
}
