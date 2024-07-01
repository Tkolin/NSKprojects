<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Хранимая процедура для обновления date_start
        DB::unprepared('
            CREATE PROCEDURE update_project_tasks_date_start(IN project_id BIGINT, IN stage_number_find INT, IN date_difference INT)
            BEGIN
                UPDATE project_tasks
                SET date_start = DATE_ADD(date_start, INTERVAL date_difference DAY)
                WHERE project_id = project_id AND stage_number = stage_number_find;
            END;
        ');

        // Хранимая процедура для обновления date_end
        DB::unprepared('
            CREATE PROCEDURE update_project_tasks_date_end(IN project_id BIGINT, IN stage_number_find INT, IN date_difference INT)
            BEGIN
                UPDATE project_tasks
                SET date_end = DATE_ADD(date_end, INTERVAL date_difference DAY)
                WHERE project_id = project_id AND stage_number = stage_number_find;
            END;
        ');

        // Триггер для обновления date_start
        DB::unprepared('
            CREATE TRIGGER update_tasks_on_stage_date_start_update
            AFTER UPDATE ON project_stages
            FOR EACH ROW
            BEGIN
                DECLARE date_diff INT;

                IF OLD.date_start != NEW.date_start THEN
                    SET date_diff = DATEDIFF(NEW.date_start, OLD.date_start);
                    CALL update_project_tasks_date_start(NEW.project_id, NEW.number, date_diff);
                END IF;
            END;
        ');

        // Триггер для обновления date_end
        DB::unprepared('
            CREATE TRIGGER update_tasks_on_stage_date_end_update
            AFTER UPDATE ON project_stages
            FOR EACH ROW
            BEGIN
                DECLARE date_diff INT;

                IF OLD.date_end != NEW.date_end THEN
                    SET date_diff = DATEDIFF(NEW.date_end, OLD.date_end);
                    CALL update_project_tasks_date_end(NEW.project_id, NEW.number, date_diff);
                END IF;
            END;
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared('
            DROP TRIGGER IF EXISTS update_tasks_on_stage_date_end_update;
            DROP TRIGGER IF EXISTS update_tasks_on_stage_date_start_update;
            DROP PROCEDURE IF EXISTS update_project_tasks_date_end;
            DROP PROCEDURE IF EXISTS update_project_tasks_date_start;
        ');
    }
};
