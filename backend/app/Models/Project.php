<?php

namespace App\Models;

use App\GraphQL\Queries\Irds;
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
        'date_end_fact',
        'date_start_fact',
        'date_start',
        'status_id',
        'prepayment',
        'date_completion',
        'price',
        'date_start',
        'path_project_folder',
        'contract_file_id',
        'kp_file_id',

        'prepayment_date',
        'prepayment_file_id'
        
    ];
    public function executor_orders()
    {
        return $this->hasManyThrough(
            ExecutorOrder::class,
            ProjectTasks::class,
            'project_id', // Foreign key on ProjectTask table...
            'id', // Foreign key on ExecutorOrder table...
            'id', // Local key on Project table...
            'task_id', // Local key on ProjectTask table...
        );
    }
    //  project contract history
    public function contracts_files(): BelongsToMany
    {
        return $this->BelongsToMany(File::class, 'project_file', 'project_id', 'file_id')->where("type_id", "CONTRACT");
    }
    public function project_contract_history(): HasMany
    {
        return $this->hasMany(ProjectFile::class)->whereIn("type", ["CONTRACT", "CONTRACT_STAMP"], )->orderBy('number', 'DESC');
    }
    //  project kp history
    public function kp_files(): BelongsToMany
    {
        return $this->BelongsToMany(File::class, 'project_file', 'project_id', 'file_id')->where("type_id", "KP");
    }
    public function project_kp_history(): HasMany
    {
        return $this->hasMany(ProjectFile::class)->where("type", "KP")->orderBy('number');
    }
    //  contract
    public function signed_file(): BelongsTo
    {
        return $this->BelongsTo(File::class, 'signed_file_id', 'id');
    }
    //  stages
    public function stages(): BelongsToMany
    {
        return $this->BelongsToMany(Stage::class, 'project_stages', 'project_id', 'stage_id');
    }

    public function project_stages(): HasMany
    {
        return $this->hasMany(ProjectStage::class)->orderBy('number');
    }
    public function project_ts(): HasMany
    {
        return $this->hasMany(ProjectTSChapter::class);
    }
    //  irds
    public function irds(): BelongsToMany
    {
        return $this->BelongsToMany(InitialAuthorizationDocumentation::class, 'project_irds', 'project_id', 'ird_id');
    }
    public function project_irds(): HasMany
    {
        return $this->hasMany(ProjectIrds::class);
    }
    //  tasks
    public function project_tasks(): HasMany
    {
        return $this->hasMany(ProjectTasks::class, 'project_id', 'id')->orderBy('offset');
    }
    public function tasks(): BelongsToMany
    {
        return $this->BelongsToMany(Task::class, 'project_tasks', 'project_id', 'task_is');
    }
    public function delegations(): BelongsToMany
    {
        return $this->belongsToMany(Contact::class, "project_delegations", "project_id", "delegation_id");
    }
    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, "project_facilities", "project_id", "facility_id");
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
}

