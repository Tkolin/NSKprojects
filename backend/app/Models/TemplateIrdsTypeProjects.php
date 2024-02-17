<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateIrdsTypeProjects extends Model
{
    public function project(): BelongsTo
    {
        return $this->belongsTo(TypeProjectDocument::class);
    }
    public function stage(): BelongsTo
    {
        return $this->belongsTo(InitialAuthorizationDocumentation::class);
    }
}
