<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GroupTypeProjectDocument extends Model
{
    protected $fillable = [
        'code',
        'name',
        'technical_specification_id',
    ];
    public function typeProjectDocuments(): HasMany
    {
        return $this->hasMany(TypeProjectDocument::class);
    }
    public function technical_specification(): BelongsTo
    {
        return $this->belongsTo(TechnicalSpecification::class);
    }
}
