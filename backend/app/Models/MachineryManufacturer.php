<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MachineryManufacturer extends Model
{
    protected $table = 'machinery_manufacturer';

    protected $fillable = [
        'name',
    ];
}
