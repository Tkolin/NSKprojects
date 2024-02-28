<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectPayment extends Model
{
    protected $fillable = [
        'date_time_payment',
        'project_id',
        'type_payment_id',
        'price',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
    public function type_payment(): BelongsTo
    {
        return $this->belongsTo(TypePayment::class);
    }
}
