<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ParameterModel extends Model
{
    use HasFactory;
    protected $table = 'parameters';

    protected $fillable = [
        'id',
        'name',
        'unit_id',
        'group_id',
        'min',
        'max'
    ];
    public function group(): BelongsTo
    {
        return $this->belongsTo(ParameterGroup::class);
    }
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }
}
