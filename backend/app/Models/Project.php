<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Project extends Model
{
    protected $fillable = [
        'number',
        'name',
        'organization_customer_id',
        'type_project_document_id',
        'date_signing',
        'duration',
        'date_end',
        'status_id',
        'date_completion',
        'price',
        'date_create',
        ];
    public function delegations(): BelongsToMany
    {
        return $this->belongsToMany(Contact::class, "project_delegations","project_id","delegation_id");
    }
    public function organization_customer(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
    public function type_project_document(): BelongsTo
    {
        return $this->belongsTo(TypeProjectDocument::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(ProjectStatus::class);
    }

    public function project_responsible_person(): HasMany
    {
        return $this->hasMany(ProjectResponsiblePerson::class);
    }
    public function project_stages(): HasMany
    {
        return $this->hasMany(ProjectStage::class);
    }
    public function project_status(): HasMany
    {
        return $this->hasMany(ProjectStatus::class);
    }
    public function project_delegations(): HasMany
    {
        return $this->hasMany(ProjectDelegations::class);
    }
    public function project_facilitys(): HasMany
    {
        return $this->hasMany(ProjectFacilities::class);
    }
    public function project_irds(): HasMany
    {
        return $this->hasMany(ProjectIrds::class);
    }
    public function project_payment(): HasMany
    {
        return $this->hasMany(ProjectPayment::class);
    }

}

