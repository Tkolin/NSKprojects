<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delay extends Model
{
    protected $fillable = [
        'id',
        'project_Id',
        'date_start',
        'date_end',
        'duration',
        'description',
        'delay_type',
        'provider'
    ];

    public function delay_project_tasks(): HasMany
    {
        return $this->hasMany(
            DelayProjectTask::class
        );
    }
}
