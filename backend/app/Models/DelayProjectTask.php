<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DelayProjectTask extends Model
{
    protected $fillable = [
        'delay_type',
        'delay_id',
        'project_task_id',
    ];
    public function project_task(): HasOne
    {
        return $this->hasOne(ProjectTasks::class);
    }
}
