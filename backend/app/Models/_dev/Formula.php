<?php

namespace App\Models\_dev;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Formula extends Model
{
    protected $table = 'formulas';

    protected $fillable = [
        'original_formula',
        'latex_formula',
        'rpn_formula',
        'name_key',
        'name',
        'description',
    ];
    public function variable_data(): HasMany
    {
        return $this->hasMany(FormulaVariable::class);
    }
}
