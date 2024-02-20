<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stage extends Model
{
    protected $fillable = [
        'name',
    ];
    public function project_stage(): HasMany
    {
        return $this->hasMany(ProjectStage::class);
    }
    public function template_stage(): HasMany
    {
        return $this->hasMany(TemplateStagesTypeProjects::class);
    }
}
