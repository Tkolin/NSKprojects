<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PasspotPlaceIssue extends Model
{
    protected $table = 'passport_place_issues';
    protected $fillable = [
        'name',
        'code',
    ];
    public function passport(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Passport::class);
    }
}
