<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Note extends Model
{
    protected $fillable = [
        'name',
    ];
    public function templateIrdsTypeProjects(): HasMany
    {
        return $this->hasMany(TemplateIrdsTypeProjects::class);
    }
}
