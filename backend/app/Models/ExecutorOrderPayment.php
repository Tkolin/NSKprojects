<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExecutorOrderPayment extends Model
{
    protected $table = 'executor_order_payments';

    protected $fillable = [
        'id',
        'executor_order_id',
        'file_id',
        'paycheck_file_id',
        'status',
        'type_payment',
    ];
    public function executor_order(): BelongsTo
    {
        return $this->belongsTo(ExecutorOrder::class, 'executor_order_id', 'id');
    }

    public function getProject(): ?Project
    {
        return Project::query()
            ->join('project_tasks', 'projects.id', '=', 'project_tasks.project_id')
            ->join('executor_order_task', 'project_tasks.id', '=', 'executor_order_task.project_task_id')
            ->join('executor_orders', 'executor_order_task.executor_order_id', '=', 'executor_orders.id')
            ->join('executor_order_payments', 'executor_orders.id', '=', 'executor_order_payments.executor_order_id')
            ->where('executor_order_payments.id', $this->id)
            ->select('projects.*')
            ->first();
    }



}
