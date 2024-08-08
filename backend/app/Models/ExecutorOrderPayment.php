<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExecutorOrderPayment extends Model
{
    protected $fillable = [
        'id',
        'executor_order_id',
        'file_id',
        'status',
    ];
}
