<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'patronymic',
        'birth_day',
        'mobile_phone',
        'work_phone',
        'work_email',
        'email',
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
    public function directors(): HasMany
    {
        return $this->HasMany(Organization::class);
    }

    public function delegates(): HasMany
    {
        return $this->HasMany(ProjectDelegations::class);
    }
}
