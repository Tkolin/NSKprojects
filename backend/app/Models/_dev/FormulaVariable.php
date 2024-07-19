<?php

namespace App\Models\_dev;

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
