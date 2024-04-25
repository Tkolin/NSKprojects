<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MachineryExcavator extends Model
{
    protected $fillable = [
        'manufacturer_id',
        'model',
        'bucket_capacity',
        'digging_depth_max',
        'digging_height_max',
        'unloading_height_max',
        'digging_radius_stationary_max',
        'digging_radius_max',
        'unloading_radius_max',
        'cycle_duration',
        'excavator_width',
        'excavator_weight',
        'engine_power',
        'bucket_type_id'
    ];
    public function manufacturer(): BelongsTo
    {
        return $this->belongsTo(MachineryManufacturer::class);
    }
    public function bucket_type(): BelongsTo
    {
        return $this->belongsTo(MachineryExcavatorBucketType::class);
    }
}
