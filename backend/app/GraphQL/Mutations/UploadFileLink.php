<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\File;

final readonly class UploadFileLink
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        $file = File::where('path', $args['url'])->first();

        if ($file) {
            return [
                'success' => true,
                'file' => $file,
            ];
        }

        return [
            'success' => false,
            'file' => null,
        ];
    }
}
