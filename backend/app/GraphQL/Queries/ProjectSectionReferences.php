<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\ProjectSectionsReference;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

final readonly class ProjectSectionReferences
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
            $query = ProjectSectionsReference::with('project:id,name')
                ->with('section_reference');

            if (isset($args['projectId'])) {
                $searchTerm = $args['projectId'];
                $query = $query
                    ->where('project_id', $searchTerm);
            }
            else
                return null;

            return $query->get();


    }
}
