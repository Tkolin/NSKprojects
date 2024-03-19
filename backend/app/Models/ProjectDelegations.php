<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDelegations extends Model
{
    protected $fillable = [
        'project_id',
        'delegation_id',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, "project_id");
    }
    public function contacts(): BelongsTo
    {
        return $this->belongsTo(Contact::class, "delegation_id");
    }
}
