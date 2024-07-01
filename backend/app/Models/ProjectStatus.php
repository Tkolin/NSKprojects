<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectStatus extends Model
{
    protected $fillable = [
        'name',
        'name_key',
    ];
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'status_id', 'name_key');
    }

}

