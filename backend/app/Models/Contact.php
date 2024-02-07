<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'patronymic',
        'mobile_phone',
        'work_phone',
        'email',
        'sibnipi_email',
        'position_id',
        'organization_id',
    ];

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
