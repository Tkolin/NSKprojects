<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentType extends Model
{
    protected $fillable = [
        'id',
        'name',
        'group_id'
    ];
    public function group(): BelongsTo
    {
        return $this->belongsTo(EquipmentGroup::class, 'group_id', 'id');
    }
    use HasFactory;
}
