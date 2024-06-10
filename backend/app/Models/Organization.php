<?php

namespace App\Models;

use App\Traits\RelationsManager;
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
        'address_legal',
        'office_number_legal',
        'address_mail',
        'office_number_mail',
        'phone_number',
        'fax_number',
        'email',
        'INN',
        'OGRN',
        'OKPO',
        'KPP',
        'bik_id',
        'payment_account',
        'director_id',
    ];
    protected $rules = [
        'full_name' => 'required', // добавляем правило, что поле full_name обязательное
    ];

    public function legal_form(): BelongsTo
    {
        return $this->belongsTo(LegalForm::class);
    }
    public function bik(): BelongsTo
    {
        return $this->belongsTo(Bik::class, "BIK_id");
    }
    public function director(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }
    public function project(): HasMany
    {
        return $this->hasMany(Project::class, "organization_customer_id");
    }
    public function employees(): HasMany
    {
        return $this->hasMany(Contact::class);
    }
}
