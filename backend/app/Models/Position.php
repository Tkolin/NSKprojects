<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Position extends Model
{
    protected $fillable = [
        'name',
        'okpd_code',
        'okz_code',
    ];

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }
}
