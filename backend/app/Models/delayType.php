<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DelayType extends Model
{
    use HasFactory;
    protected $fillable = [
        'key',
        'name',
        'description',
        'type',
        'content',
        'content_number',
    ];
}
