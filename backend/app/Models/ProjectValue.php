<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectValue extends Model
{

    protected $table = 'project_values';

    protected $fillable = [
        'id',
        'project_id',
        'name',
        'description',
        'type',
        'value',
    ];
}
