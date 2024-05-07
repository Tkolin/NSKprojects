<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fenrir extends Model
{
    protected $fillable = [
        'name',
        'description',
        'models',
    ];
}
