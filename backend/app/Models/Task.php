<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    protected $fillable = [
        'name',
    ];
    public function project_task(): HasMany
    {
        return $this->hasMany(ProjectTasks::class);
    }
    public function template_tasks_type_projects(): HasMany
    {
        return $this->hasMany(TemplateTasksTypeProject::class);
    }
}
