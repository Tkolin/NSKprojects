<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PasspotPlaceIssue extends Model
{
    protected $table = 'passport_place_issues';
    protected $fillable = [
        'name',
        'code',
    ];
    public function passports(): HasMany
    {
        return $this->hasMany(Passport::class);
    }
}
