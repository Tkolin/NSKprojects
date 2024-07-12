<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    protected $fillable = [
        'executor_order_id','task_id',
     ];
    public function project_task(): HasMany
    {
        return $this->hasMany(ProjectTasks::class);
    }

}
