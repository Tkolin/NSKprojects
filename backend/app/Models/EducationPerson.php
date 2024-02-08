<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EducationPerson extends Model
{
    protected $fillable = [
        'education_id',
        'person_id',
    ];
    public function person(): BelongsTo
    {
        return $this->belongsTo(Person::class);
    }
    public function education(): BelongsTo
    {
        return $this->belongsTo(Education::class);
    }
}
