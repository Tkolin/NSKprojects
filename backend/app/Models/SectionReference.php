<?php

namespace App\Models;

use App\GraphQL\Queries\ProjectSectionReferences;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SectionReference extends Model
{
    protected $fillable = [
        'name',
        'description',
        'values'
    ];
    public function project_sections_reference(): HasMany
    {
        return $this->hasMany(ProjectSectionsReference::class);
    }
    public function template_sections_reference(): HasMany
    {
        return $this->hasMany(TemplateSectionReference::class);
    }
}
