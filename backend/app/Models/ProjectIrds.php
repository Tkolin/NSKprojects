<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectIrds extends Model
{
    protected $fillable = [
        'received'
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
    public function ird(): BelongsTo
    {
        return $this->belongsTo(InitialAuthorizationDocumentation::class);
    }
}
