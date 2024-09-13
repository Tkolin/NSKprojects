<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GroupTypeProjectDocument extends Model
{
    protected $table = 'group_type_project_documents';

    protected $fillable = [
        'id',
        'code',
        'technical_specification',
        'name',
    ];
    public function typeProjectDocuments(): HasMany
    {
        return $this->hasMany(TypeProjectDocument::class);
    }
}
