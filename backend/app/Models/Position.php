<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Position extends Model
{
    protected $fillable = [
        'name',
        'okpd_code',
        'okz_code',
    ];

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }
}
