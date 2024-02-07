<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EducationalInstitution extends Model
{
    protected $fillable = [
        'name',
    ];
    public function education(): HasMany
    {
        return $this->hasMany(Education::class);
    }
}
