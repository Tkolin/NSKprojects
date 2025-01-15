<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\ProjectStage;
use Illuminate\Support\Facades\Log;

final readonly class CheckedSendDocumentsStageExecutors
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        // Логируем входящие аргументы
        Log::info('CheckedSendDocumentsStageExecutors called', ['args' => $args]);

        $project_id = $args["projectId"] ?? null;
        $stage_id = $args["stageId"] ?? null;

        // Проверяем входные данные
        if (!$project_id || !$stage_id) {
            Log::error('Missing required parameters', ['project_id' => $project_id, 'stage_id' => $stage_id]);
            throw new \InvalidArgumentException('project_id and stage_id are required');
        }

        // Логируем параметры перед запросом
        Log::info('Fetching ProjectStage', ['project_id' => $project_id, 'stage_id' => $stage_id]);

        // Обновление без вызова save()
        $updated = ProjectStage::where('project_id', $project_id)
            ->where('stage_id', $stage_id)
            ->update([
                'is_send_executor' => \DB::raw('NOT is_send_executor'), // Инверсия значения на уровне SQL
                'updated_at' => now(),
            ]);

        if ($updated === 0) {
            Log::error('ProjectStage not found or not updated', ['project_id' => $project_id, 'stage_id' => $stage_id]);
            throw new \Exception('Failed to update ProjectStage');
        }

        // Получаем обновленную запись
        $newProjectStage = ProjectStage::where('project_id', $project_id)
            ->where('stage_id', $stage_id)
            ->first();

        Log::info('is_send_executor updated successfully', [
            'project_id' => $project_id,
            'stage_id' => $stage_id,
            'new_value' => $newProjectStage->is_send_executor,
        ]);

        return $newProjectStage;
    }
}
