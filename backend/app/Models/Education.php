<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Education extends Model
{
    protected $fillable = [
        'number',
        'type_document_id',
        'institution_id',
        'qualification_id',
        'specialization_id',
    ];
    public function institution(): BelongsTo
    {
        return $this->belongsTo(EducationalInstitution::class);
    }
    public function qualification(): BelongsTo
    {
        return $this->belongsTo(EducationQualification::class);
    }
    public function type_document(): BelongsTo
    {
        return $this->belongsTo(TypeEducationDocument::class);
    }
    public function specialization(): BelongsTo
    {
        return $this->belongsTo(EducationSpecialization::class);
    }
}
