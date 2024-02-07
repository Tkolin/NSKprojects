<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    protected $fillable = [
        'legal_form_id',
        'name',
        'full_name',
        'address_legal_id',
        'office_number_legal',
        'address_mail_id',
        'office_number_mail',
        'phone_number',
        'fax_number',
        'email',
        'INN',
        'OGRN',
        'OKPO',
        'KPP',
        'BIK_id',
        'payment_account',
        'director_id',
    ];

    public function legal_form(): BelongsTo
    {
        return $this->belongsTo(LegalForm::class);
    }
    public function address_legal(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }
    public function address_mail(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }
    public function BIK(): BelongsTo
    {
        return $this->belongsTo(Bik::class);
    }
    public function director(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
    public function project(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
