<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TypePayment extends Model
{
    protected $table = 'type_payment';


    protected $fillable = [
        'name',
    ];
    public function facility(): HasMany
    {
        return $this->hasMany(Facility::class);
    }
}
