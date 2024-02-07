<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Person extends Model
{
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
        'note_id',
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
    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }
    public function project_responsible_person(): HasMany
    {
        return $this->hasMany(ProjectResponsiblePerson::class);
    }
}
