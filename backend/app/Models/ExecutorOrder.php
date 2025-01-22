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
        'executor_id',
        'original_file_id',
        'is_possible_mainpayment',
        'is_possible_postpayment',
        'is_possible_prepayment'
    ];

    public function isProjectPrepayment(): bool
    {
        $task = $this->tasks()->first();

        if ($task && $project = $task->project()->first())
            return $project ? (bool) $project->prepayment_file_id : false;

        return false;
    }

    public function isAllTasksPayment(): bool
    {
        $tasks = $this->tasks;
        if ($tasks->isEmpty()) {
            error_log("isEmpty " . "false");

            return false; // Нет задач, не все этапы могут быть оплачены
        }

        foreach ($tasks as $task) {
            $project = $task->project()->first();

            if (!$project) {
                error_log("!project " . "false");

                return false; // Если нет проекта, этапы не могут быть оплачены
            }

            $unpaidStages = $project->project_stages()->whereNull('payment_file_id')->exists();

            if ($unpaidStages) {
                error_log("!unpaidStages " . "false");

                return false; // Есть неоплаченные этапы
            }
        }
        error_log(message: "true " . "true");

        return true; // Все этапы оплачены
    }
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
        return $this->executor_order_payments()
            ->whereNotNull('file_id')
            ->where('status', 'COMPLETED')
            ->pluck('type_payment')
            ->toArray();
    }

    public function signed_file(): BelongsTo
    {
        return $this->belongsTo(File::class, 'signed_file_id', 'id');
    }
    public function project()
    {
        $task = $this->project_tasks()->first();

        return $task ? $task->project : null;
    }
    public function fetchProject()
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
    public function get_price(): float
    {
        // Получаем все связанные проектные задачи
        $project_tasks = $this->project_tasks;

        // Суммируем цену всех задач
        $result = $project_tasks->sum(function ($task) {
            return $task->price ?: 0; // Если цена задачи не указана, считаем 0
        });

        return $result;
    }
    public function get_executor(): Person
    {
        // Получаем все связанные проектные задачи
        $project_tasks = $this->project_tasks;

        // Проверяем, есть ли задачи и возвращаем executor первой задачи
        if ($project_tasks->isNotEmpty()) {
            $executor = $project_tasks[0]->executor; // Это уже объект Person
            return $executor;
        }

        // Если задач нет, возвращаем null или выбрасываем исключение, в зависимости от того, что вам нужно
        return null;
    }



    public function tasks(): BelongsToMany
    {
        return $this->belongsToMany(ProjectTasks::class, "executor_order_task", "executor_order_id", "project_task_id");
    }
}
