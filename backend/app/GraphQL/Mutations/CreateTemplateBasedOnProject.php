<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

final readonly class CreateTemplateBasedOnProject
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $projectId =$args["projectId"];
        error_log("projectId ".$projectId);
    }
}
