<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Passport extends Model
{
    protected $fillable = [
        'firstname',
        'lastname',
        'patronymic',
        'serial',
        'number',
        'passport_place_issue_id',
        'address_registration',
        'address_residential ',
        'birth_date',
        'date',
    ];
    public function passport_place_issue(): BelongsTo
    {
        return $this->belongsTo(PasspotPlaceIssue::class);
    }

    public function person(): HasMany
    {
        return $this->hasMany(Person::class);
    }
}
