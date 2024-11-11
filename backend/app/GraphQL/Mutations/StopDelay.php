<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Delay;
use App\Models\Project;
use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

final readonly class StopDelay
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        DB::beginTransaction(); // Начинаем транзакцию

        try {
            Log::info('Start processing StopDelay mutation', ['args' => $args]);

            $id = $args["delayId"];
            $dateEnd = new DateTime($args["dateStop"]); // Преобразование строки в DateTime

            $delay = Delay::find($id);

            if (!$delay) {
                throw new Exception('Delay record not found');
            }

            $dateStart = new DateTime($delay->date_start); // Преобразование строки в DateTime
            $duration = $dateEnd->diff($dateStart)->days; // Расчет длительности в днях

            $delay->duration = $duration;
            $delay->date_end = $dateEnd->format('Y-m-d'); // Приведение к строке для сохранения
            $delay->save(); // Сохраняем изменения в задержке

            Log::info('Delay record updated', ['delay_id' => $delay->id, 'duration' => $duration]);

            $delayTasks = $delay->project_tasks()->get();

            foreach ($delayTasks as $projectTask) {
                switch ($projectTask->status) {
                    case 'AWAITING':
                        $projectTask->offset += $duration; // В днях

                        $projectTaskDateStart = new DateTime($projectTask->date_start);
                        $projectTaskDateEnd = new DateTime($projectTask->date_end);

                        // Обновляем даты задач проекта
                        $projectTaskDateStart->modify("+{$duration} days");
                        $projectTaskDateEnd->modify("+{$duration} days");

                        $projectTask->date_start = $projectTaskDateStart->format('Y-m-d');
                        $projectTask->date_end = $projectTaskDateEnd->format('Y-m-d');
                        $projectTask->save();

                        Log::info('Project task updated', ['task_id' => $projectTask->id, 'new_start' => $projectTask->date_start, 'new_end' => $projectTask->date_end]);
                        break;

                    case 'WORKING':
                        $projectTask->duration += $duration;
                        error_log("projectTask->date_start_fact". $projectTask->date_start_fact);
                        $projectTaskDateStartFact = new DateTime($projectTask->date_start_fact);

                        // Вычисляем фактическую дату окончания на основе фактической даты начала и длительности задачи
                        $projectTaskDateEndFact = clone $projectTaskDateStartFact;
                        $projectTaskDateEndFact->modify("+{$projectTask->duration} days");

                        $projectTask->date_end_fact = $projectTaskDateEndFact->format('Y-m-d');
                        $projectTask->save();

                        Log::info('Project task (WORKING) updated', ['task_id' => $projectTask->id, 'new_end_fact' => $projectTask->date_end_fact]);
                        break;

                    default:
                        Log::warning('Unhandled project task status', ['task_id' => $projectTask->id, 'status' => $projectTask->status]);
                        break;
                }
            }

            DB::commit(); // Коммитим транзакцию
            Log::info('StopDelay mutation processed successfully');

            return [
                'project' => Project::find($delay->project_id),
                'delay' => Delay::find($delay->id),
            ];

        } catch (Exception $e) {
            DB::rollBack(); // Откатываем транзакцию в случае ошибки
            Log::error('Error processing StopDelay mutation', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e; // Пробрасываем исключение дальше
        }
    }
}
