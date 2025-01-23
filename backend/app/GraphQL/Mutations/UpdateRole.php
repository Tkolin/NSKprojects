<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\PermissionRole;
use App\Models\Role;

final readonly class UpdateRole
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $role = Role::where('name_key', $args['name_key'])->firstOrFail();

        // Синхронизируем права
        $role->permissions()->sync($args['data']["permission_keys"]); // $args['permissions'] – массив key
        return $role;
    }
}
