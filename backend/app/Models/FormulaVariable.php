<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FormulaVariable extends Model
{
    protected $table = 'formula_variables';

    protected $fillable = [
        'formula_id',
        'name',
        'name_key',
        'description',
    ];
}
