<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParameterModel extends Model
{
    use HasFactory;
    protected $table = 'parameters';

    protected $fillable = [
        'id',
        'name',
        'unit_id',
        'min',
        'max'
    ];
}
