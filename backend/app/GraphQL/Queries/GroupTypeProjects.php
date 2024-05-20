<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\GroupTypeProjectDocument;

final readonly class GroupTypeProjects
{
    /** @param array{} $args */
    public function __invoke(null $_, array $args)
    {
        if(!isset($args['queryOptions']))
            switch ($args['queryType']){
                case "COMPACT":
                    return ['items' => GroupTypeProjectDocument::all()];
                case "BY_ID":
                    if (!isset($args['id'])) {
                        return ['Ошибка, отсутствует id'];
                    }
                    $data = GroupTypeProjectDocument::find($args['id']);
                    if ($data) {
                        return $data;
                    } else {
                        return ['Ошибка, контакт не найден'];
                    }
                default:
                    return ["Ошибка, не верный тип запрооса"];
            }

        return GroupTypeProjectDocument::with("technical_specification")->get();
    }
}
