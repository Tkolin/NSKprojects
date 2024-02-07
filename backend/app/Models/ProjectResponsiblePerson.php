<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectResponsiblePerson extends Model
{
    protected $fillable = [
        'project_id',
        'person_id',
    ];
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }
}

