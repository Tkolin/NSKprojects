<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectContents extends Model
{
    protected $fillable = [
        'project_id',
        'content_id',
        'number'
    ];
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
    public function contents(): BelongsTo
    {
        return $this->belongsTo(Contents::class);
    }
}
