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
    public function project(): ?Project
    {
        // Получаем связанную запись executor_order
        $executorOrder = $this->executor_order()->first();

        // Возвращаем проект через связь executor_order->project()
        return $executorOrder ? $executorOrder->project : null;
    }


}
