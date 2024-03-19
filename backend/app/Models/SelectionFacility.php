<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SelectionFacility extends Model
{
    protected $fillable = [
        'name',
    ];
    public function selection_facilities(): HasMany
    {
        return $this->hasMany(SubselectionFacility::class);
    }
}
