<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExecutorOrderPayment extends Model
{
    protected $table = 'executor_order_payments';

    protected $fillable = [
        'id',
        'executor_order_id',
        'file_id',
        'status',
        'type_payment',
    ];
}
