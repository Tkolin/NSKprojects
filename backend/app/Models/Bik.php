<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bik extends Model
{
    protected $fillable = [
        'BIK',
        'name',
        'city',
        'correspondent_account',
        'created_at',
        'updated_at'
    ];
    public function person(): HasMany
    {
        return $this->hasMany(Person::class);
    }
    public function organizations(): HasMany
    {
        return $this->hasMany(Organization::class);
    }
}
