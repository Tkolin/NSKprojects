<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectTypeFile extends Model
{
    protected $fillable = [
        'name',
        'name_key',
        'type_id',
    ];
}
