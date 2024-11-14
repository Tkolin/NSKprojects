<?php declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Project;
use Carbon\Carbon;

final readonly class CheckStatusProject
{
    /** @param  array{}  $args */
    public function __invoke($_, array $args): array
    {
        $projectId = $args['projectId'];
        $notifications = [];

        // Получаем проект с задачами и ИРД
        $project = Project::with(['project_irds', 'project_tasks'])->find($projectId);

        if (!$project) {
            return [
                [
                    'id' => uniqid(),
                    'title' => 'Проект не найден',
                    'type' => 'error',
                    'content' => 'Проект с указанным ID не найден.',
                ],
            ];
        }

        // Проверка отсутствующих ИРД
        $missingIrd = $project->project_irds->filter(fn($ird) => is_null($ird->received_date));
        foreach ($missingIrd as $ird) {
            $notifications[] = [
                'id' => uniqid(),
                'title' => 'Отсутствует ИРД',
                'type' => 'warning',
                'content' => "Отсутствует ИРД: {$ird->ird->name}.",
                'link_text' => 'Просмотреть ИРД',
                'link_button' => "/projects/{$projectId}/irds",
            ];
        }

        // Проверка забракованных ИРД
        $brokenIrd = $project->project_irds->filter(fn($ird) => $ird->is_broken === 1);
        foreach ($brokenIrd as $ird) {
            $notifications[] = [
                'id' => uniqid(),
                'title' => 'Забракованное ИРД',
                'type' => 'error',
                'content' => "Забраковано ИРД: {$ird->ird->name}.",
                'link_text' => 'Просмотреть забракованное ИРД',
                'link_button' => "/projects/{$projectId}/irds",
            ];
        }

        // Проверка задач
        $currentDate = Carbon::now();

        $notStartedTasks = $project->project_tasks->filter(function ($task) use ($currentDate) {
            $dateStart = $task->date_start ? Carbon::parse($task->date_start) : null;
            return $task->status === 'AWAITING' && $dateStart && $currentDate->gt($dateStart);
        });

        foreach ($notStartedTasks as $task) {
            $notifications[] = [
                'id' => uniqid(),
                'title' => 'Задача должна была начаться',
                'type' => 'info',
                'content' => "Задача {$task->task->name} должна была начаться {$task->date_start}.",
                'link_text' => 'Просмотреть задачу',
                'link_button' => "/projects/{$projectId}/tasks/{$task->task->name}",
            ];
        }

        // Задачи, которые начнутся в ближайшие 3 дня
        $upcomingTasks = $project->project_tasks->filter(function ($task) use ($currentDate) {
            $dateStart = $task->date_start ? Carbon::parse($task->date_start) : null;
            return $task->status === 'AWAITING' && $dateStart && $dateStart->between($currentDate, $currentDate->clone()->addDays(3));
        });
        foreach ($upcomingTasks as $task) {
            $notifications[] = [
                'id' => uniqid(),
                'title' => 'Задача скоро начнётся',
                'type' => 'info',
                'content' => "Задача {$task->task->name} начнётся {$task->date_start}.",
                'link_text' => 'Просмотреть задачу',
                'link_button' => "/projects/{$projectId}/tasks/{$task->task->name}",
            ];
        }

        // Проверка требований проекта на основе getRequirementsAttribute
        $requirements = $project->getRequirementsAttribute();

        foreach ($requirements as $requirement) {
            $notifications[] = [
                'id' => uniqid(),
                'title' => 'Проблема с проектом',
                'type' => 'warning',
                'content' => $requirement['comment'],
                'link_text' => 'Подробнее о проекте',
                'link_button' => "/projects/{$projectId}",
            ];
        }

        return $notifications;
    }
    public function getRequirementsAttribute($project)
    {
        $result = [];

        switch ($project->status->name_key) {
            case 'DESIGN_REQUEST':
                if (!$project->name)
                    $result[] = ['comment' => 'Отсутствует имя проекта'];
                if (!$project->organization_customer?->id)
                    $result[] = ['comment' => 'Отсутствует организация заказчик'];
                if ($project->facilities->count() <= 0)
                    $result[] = ['comment' => 'Отсутствуют объекты проектирования'];
                if (!$project->duration)
                    $result[] = ['comment' => 'Отсутствует продолжительность'];
                if (!$project->type_project_document?->id)
                    $result[] = ['comment' => 'Отсутствует тип документации'];
                if (!$project->price)
                    $result[] = ['comment' => 'Отсутствует стоимость'];
                break;

            case 'APPROVAL_KP':
                if (!$project->name)
                    $result[] = ['comment' => 'Отсутствует имя проекта'];
                if (!$project->organization_customer?->id)
                    $result[] = ['comment' => 'Отсутствует организация заказчик'];
                if ($project->facilities->count() <= 0)
                    $result[] = ['comment' => 'Отсутствуют объекты проектирования'];
                if (!$project->duration)
                    $result[] = ['comment' => 'Отсутствует продолжительность'];
                if (!$project->type_project_document?->id)
                    $result[] = ['comment' => 'Отсутствует тип документации'];
                if (!$project->price)
                    $result[] = ['comment' => 'Отсутствует стоимость'];
                if ($project->project_stages->count() <= 0)
                    $result[] = ['comment' => 'Отсутствуют этапы'];
                if (!$project->kp_file_id)
                    $result[] = ['comment' => 'Отсутствует подписанный файл'];
                break;

            case 'APPROVAL_AGREEMENT':
                if (!$project->name)
                    $result[] = ['comment' => 'Отсутствует имя проекта'];
                if (!$project->organization_customer?->id)
                    $result[] = ['comment' => 'Отсутствует организация заказчик'];
                if ($project->facilities->count() <= 0)
                    $result[] = ['comment' => 'Отсутствуют объекты проектирования'];
                if (!$project->duration)
                    $result[] = ['comment' => 'Отсутствует продолжительность'];
                if (!$project->type_project_document?->id)
                    $result[] = ['comment' => 'Отсутствует тип документации'];
                if (!$project->price)
                    $result[] = ['comment' => 'Отсутствует стоимость'];
                if ($project->project_stages->count() <= 0)
                    $result[] = ['comment' => 'Отсутствуют этапы'];
                if (!$project->kp_file_id)
                    $result[] = ['comment' => 'Отсутствует подписанный файл кп'];
                if ($project->project_irds->count() <= 0)
                    $result[] = ['comment' => 'Ирд не сформировано'];
                if ($project->project_irds->filter(fn($row) => $row->stage_number === 1 && !$row->received_date)->count() > 0)
                    $result[] = ['comment' => 'Ирд не получено'];
                if (!$project->date_signing)
                    $result[] = ['comment' => 'Отсутствует дата подписания'];
                if (!$project->contract_file_id)
                    $result[] = ['comment' => 'Отсутствует подписанный файл договора'];
                break;

            case 'ARCHIVE':
            case 'COMPLETED':
            case 'WAITING_SOURCE':
            case 'WORKING':
                $result[] = ['comment' => 'Не реализованн переход на следущую стадию проекта'];
                break;
        }

        return $result;
    }
}
