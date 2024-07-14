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
        'prepayment',
        'date_completion',
        'price',
        'date_create',
        'path_project_folder',
        ];
    public function executor_orders()
    {
        return $this->hasManyThrough(
            ExecutorOrder::class,
            ProjectTasks::class,
            'project_id', // Foreign key on ProjectTask table...
            'id', // Foreign key on ExecutorOrder table...
            'id', // Local key on Project table...
            'task_id' // Local key on ProjectTask table...
        )
            ->join('executor_order_task', 'executor_order_task.project_task_id', '=', 'project_tasks.id')
            ->distinct();
    }
    public function delegations(): BelongsToMany
    {
        return $this->belongsToMany(Contact::class, "project_delegations","project_id","delegation_id");
    }
    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class,"project_facilities","project_id","facility_id");
    }
    public function project_tasks(): HasMany
    {
        return $this->hasMany(ProjectTasks::class, 'project_id', 'id');
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
        return $this->belongsTo(ProjectStatus::class, 'status_id', 'name_key');
    }


    public function project_stages(): HasMany
    {
        return $this->hasMany(ProjectStage::class)->orderBy('number');
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
    public function project_sections_reference(): HasMany
    {
        return $this->hasMany(ProjectSectionsReference::class);
    }
}

