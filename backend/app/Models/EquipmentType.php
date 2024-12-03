<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class EquipmentType extends Model
{
    protected $fillable = [
        'id',
        'name',
        'type_activity_id',
        'group_id'
    ];
    public function group(): BelongsTo
    {
        return $this->belongsTo(EquipmentGroup::class, 'group_id', 'id');
    }
    public function type_activity(): BelongsTo
    {
        return $this->belongsTo(EquipmentTypeActivity::class, 'type_activity_id', 'id');
    }
    public function parameters(): BelongsToMany
    {
        return $this->belongsToMany(
            ParameterModel::class,
            'equipment_type_parameters',
            'equipment_type_id', // Внешний ключ в промежуточной таблице, связанный с текущей моделью
            'parameter_id'
        );

    }

}
