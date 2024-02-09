<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Address extends Model
{
    protected $fillable = [
        'fullAddress',
    ];
    public function organization(): HasMany
    {
        return $this->hasMany(Organization::class);
    }
}

