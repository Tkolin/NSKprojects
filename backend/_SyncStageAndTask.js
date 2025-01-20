============================================
Запрос для проверки не созданых задач в этапах
============================================
SELECT
    ps.project_id,
    s.task_id,
    ps.number AS stage_number,
    ps.duration,
    ps.offset,
    DATE_ADD(ps.date_start, INTERVAL COALESCE(ps.offset, 0) DAY) AS date_start,
    DATE_ADD(DATE_ADD(ps.date_start, INTERVAL COALESCE(ps.offset, 0) DAY), INTERVAL COALESCE(ps.duration, 0) DAY) AS date_end,
    NOW() AS created_at,
    NOW() AS updated_at
FROM
    project_stages ps
JOIN
    stages s ON ps.stage_id = s.id
LEFT JOIN
    project_tasks pt ON ps.project_id = pt.project_id AND ps.number = pt.stage_number
WHERE
    pt.id IS NULL;  -- Выбираем только те этапы, для которых задача ещё не создана

============================================
Запрос для синхронизации не созданых задач в этапах
============================================
INSERT INTO project_tasks (project_id, task_id, stage_number, duration, offset, date_start, date_end, created_at, updated_at)
SELECT ps.project_id, s.task_id, ps.number, ps.duration, ps.offset,
       DATE_ADD(ps.date_start, INTERVAL COALESCE(ps.offset, 0) DAY),
       DATE_ADD(DATE_ADD(ps.date_start, INTERVAL COALESCE(ps.offset, 0) DAY), INTERVAL COALESCE(ps.duration, 0) DAY),
       NOW(), NOW()
FROM project_stages ps
JOIN stages s ON ps.stage_id = s.id
LEFT JOIN project_tasks pt ON ps.project_id = pt.project_id AND ps.number = pt.stage_number
WHERE pt.id IS NULL;  -- Выбираем только те этапы, для которых задача ещё не создана

============================================
Запрос для синхронизации дат на задачах основаных на этапе (уже созданных)
============================================
UPDATE project_tasks pt
JOIN project_stages ps ON pt.project_id = ps.project_id AND pt.stage_number = ps.number
SET pt.date_start = DATE_ADD(ps.date_start, INTERVAL COALESCE(ps.offset, 0) DAY),
    pt.date_end = DATE_ADD(DATE_ADD(ps.date_start, INTERVAL COALESCE(ps.offset, 0) DAY), INTERVAL COALESCE(ps.duration, 0) DAY),
    pt.updated_at = NOW()
WHERE pt.project_task_inherited_id IS NULL;

============================================
Запрос для синхронизации дат начала этапов (снос даты начала проекта и установка обратно)
============================================
UPDATE project_tasks pt
JOIN project_stages ps ON pt.project_id = ps.project_id AND pt.stage_number = ps.number
SET pt.date_start = DATE_ADD(ps.date_start, INTERVAL COALESCE(ps.offset, 0) DAY),
    pt.date_end = DATE_ADD(DATE_ADD(ps.date_start, INTERVAL COALESCE(ps.offset, 0) DAY), INTERVAL COALESCE(ps.duration, 0) DAY),
    pt.updated_at = NOW()
WHERE pt.project_task_inherited_id IS NULL;

============================================
Запрос для проверки наличия дат у этапв начатых проектов
============================================
SELECT
    ps.project_id,
    ps.number AS stage_number,
    ps.date_start AS stage_start_date,
    ps.date_end AS stage_end_date,
    ps.offset,
    ps.duration
FROM project_stages ps
JOIN projects p ON ps.project_id = p.id
WHERE p.date_start IS NULL;

============================================
Запрос для проверки соответсвия стоимости проекта и этапов стоимости
============================================
SELECT
    p.id AS project_id,
    p.name AS project_name,
    p.price AS project_total_price,
    SUM(ps.price) AS stages_total_price
FROM
    projects p
JOIN
    project_stages ps ON p.id = ps.project_id
GROUP BY
    p.id
HAVING
    SUM(ps.price) <> p.price;


