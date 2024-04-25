<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TypeTechnicalSpecification extends Model
{
    protected $fillable = [
        'id',
        'name',
    ];
    public function group_type_project_documents(): HasMany
    {
        return $this->hasMany(GroupTypeProjectDocument::class);
    }

}
