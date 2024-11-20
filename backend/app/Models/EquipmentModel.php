<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class EquipmentModel extends Model
{
    protected $fillable = [
        'id',
        'model_name',
        'equipment_type_id',
        'equipment_type_activity_id',
        'supplier_id'
    ];
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(EquipmentGroup::class, 'supplier_id', 'id');
    }
    public function equipment_type(): BelongsTo
    {
        return $this->belongsTo(EquipmentGroup::class, 'equipment_type_id', 'id');
    }
    public function equipment_type_activity(): BelongsTo
    {
        return $this->belongsTo(EquipmentGroup::class, 'equipment_type_activity_id', 'id');
    }
    public function parameters(): BelongsToMany
    {
        return $this->belongsToMany(ParameterModel::class, 'equipment_model_parameters')
            ->withPivot('value'); // Добавляем value как дополнительное поле
    }
    use HasFactory;
}
