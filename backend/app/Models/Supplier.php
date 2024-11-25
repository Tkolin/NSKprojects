<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Supplier extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'name',
    ];
    public function equipment_types(): BelongsToMany
    {
        return $this->belongsToMany(EquipmentType::class, 'supplier_equipment_type'); // Добавляем value как дополнительное поле
    }
}
