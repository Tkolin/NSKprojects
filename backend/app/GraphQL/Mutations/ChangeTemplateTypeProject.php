<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\TypeProjectDocument;

final readonly class ChangeTemplateTypeProject
{
    /** @param  array{typeProject, newTemplate}  $args */
    public function __invoke(null $_, array $args)
    {
        TypeProjectDocument::where('id', $args["typeProject"])
            ->update(['template_project_id' => $args["newTemplate"]]);

        $newTypeProject = TypeProjectDocument::find($args["typeProject"]);

        return $newTypeProject;




    }
}
