<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ProjectContractHistory extends Pivot
{
    protected $table = 'project_contract_history';
    protected $fillable = [
        'project_id',
        'file_id',
        'number',
        'comment',
        'date_create_contract',
        'created_at',
        'updated_at',
    ];

}
