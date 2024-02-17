<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'number',
        'name',
        'organization_customer_id',
        'type_project_document_id',
        'facility_id',
        'date_signing',
        'duration',
        'date_end',
        'status_id',
        'date_completion',
        'delegate_id'
    ];

    public function organization_customer(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
    public function type_project_document(): BelongsTo
    {
        return $this->belongsTo(TypeProjectDocument::class);
    }
    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class);
    }
    public function status(): BelongsTo
    {
        return $this->belongsTo(ProjectStatus::class);
    }
    public function delegate(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
    public function project_responsible_person(): HasMany
    {
        return $this->hasMany(ProjectResponsiblePerson::class);
    }
    public function project_stage(): HasMany
    {
        return $this->hasMany(ProjectStage::class);
    }
    public function project_status(): HasMany
    {
        return $this->hasMany(ProjectStatus::class);
    }
    public function project_irds(): HasMany
    {
        return $this->hasMany(ProjectIrds::class);
    }
}

