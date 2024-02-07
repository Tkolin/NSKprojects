<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TypeProjectDocument extends Model
{
    protected $fillable = [
        'code',
        'name',
    ];
    public function project(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
