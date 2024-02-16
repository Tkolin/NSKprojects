<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Person extends Model
{
    protected $table = 'persons';
    protected $fillable = [
        'passport_id',
        'SHILS',
        'INN',
        'payment_account',
        'phone_number',
        'email',
        'email_sibnipi',
        'bank_id',
        'bik_id',
        'delegate_id',
    ];

    public function passport(): BelongsTo
    {
        return $this->belongsTo(Passport::class);
    }
    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class);
    }
    public function bik(): BelongsTo
    {
        return $this->belongsTo(Bik::class);
    }

    public function project_responsible_person(): HasMany
    {
        return $this->hasMany(ProjectResponsiblePerson::class);
    }
    public function education_person(): HasMany
    {
        return $this->hasMany(EducationPerson::class);
    }
}
