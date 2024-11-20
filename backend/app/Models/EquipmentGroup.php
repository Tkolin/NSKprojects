<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentGroup extends Model
{
    protected $fillable = [
        'id',
        'name'
    ];
    use HasFactory;
}
