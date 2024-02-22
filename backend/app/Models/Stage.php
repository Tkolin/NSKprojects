<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class  Stage extends Model
{
    protected $table = 'stages';

    protected $fillable = [
        'name',
    ];
    public function project_stage(): HasMany
    {
        return $this->hasMany(ProjectStage::class);
    }
    public function template_stages_type_projects(): HasMany
    {
        return $this->hasMany(TemplateStagesTypeProjects::class);
    }
}
