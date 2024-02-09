<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LegalForm extends Model
{
    protected $fillable = [
        'name',
        'full_name',
    ];
    public function organization(): HasMany
    {
        return $this->hasMany(Organization::class);
    }
}

