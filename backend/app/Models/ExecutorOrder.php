<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function isTaskCompleted(): bool
    {
        return !$this->tasks()->where('status', '<>', 'COMPLETED')->exists();
    }

    public function isProjectCompleted(): bool
    {
        // Получаем первую задачу
        $task = $this->tasks()->first();

        // Проверяем, существует ли задача и ее проект
        if ($task && $project = $task->project()->first()) {
            // Проверяем статус проекта
            return $project->status_id === 'COMPLETED';
        }

        // Возвращаем false, если задача или проект не найдены
        return false;
    }

    public function getFilesPaymentsTypes(): array
    {
        return $this->tasks()
            ->join('executor_order_task as eot', 'project_tasks.id', '=', 'eot.project_task_id')
            ->join('executor_order_payments as eop', 'eot.executor_order_id', '=', 'eop.executor_order_id')
            ->where('eot.executor_order_id', $this->id)
            ->whereNotNull('eop.file_id') // Условие, что file_id не должен быть NULL
            ->pluck('eop.type_payment') // Получить массив значений type_payment
            ->toArray(); // Преобразовать Collection в массив
    }
    public function signed_file(): BelongsTo
    {
        return $this->belongsTo(File::class, 'signed_file_id', 'id');
    }
    public function project(): BelongsTo
    {
        $task = $this->project_tasks()->first();

        return $task ? $task->project : null;
    }


    public function executor_order_payments(): HasMany
    {
        return $this->HasMany(ExecutorOrderPayment::class);
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
