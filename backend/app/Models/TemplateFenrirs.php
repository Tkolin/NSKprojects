<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemplateFenrirs extends Model
{
    protected $fillable = [
        'name',
        'description',
        'models',
    ];
}
