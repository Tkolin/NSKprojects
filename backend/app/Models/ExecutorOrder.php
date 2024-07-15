<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ExecutorOrder extends Model
{
    protected $fillable = [
        'number',
        'date_generate',
        'date_order',
        'date_attachment',
        'signed_file_id',
        'original_file_id',
    ];
    public function signed_file(): BelongsTo
    {
        return $this->belongsTo(File::class, 'signed_file_id','id');
    }    public function original_file(): BelongsTo
    {
        return $this->belongsTo(File::class, 'original_file_id','id');
    }


    public function project_tasks(): BelongsToMany
    {
        return $this->belongsToMany(
            ProjectTasks::class,
            'executor_order_task', // Table name
            'executor_order_id',   // Foreign key on executor_order_task table
            'project_task_id'      // Foreign key on executor_order_task table
        );
    }
    public function tasks(): BelongsToMany
    {
        return $this->belongsToMany(ProjectTasks::class, "executor_order_task", "executor_order_id", "project_task_id");
    }
}
