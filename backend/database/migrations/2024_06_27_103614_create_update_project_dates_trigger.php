<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        DB::unprepared('
            CREATE TRIGGER update_project_dates_after_insert
            AFTER INSERT ON project_irds
            FOR EACH ROW
            BEGIN
                CALL update_project_dates(NEW.project_id);
            END
        ');

        DB::unprepared('
            CREATE TRIGGER update_project_dates_after_update
            AFTER UPDATE ON project_irds
            FOR EACH ROW
            BEGIN
                CALL update_project_dates(NEW.project_id);
            END
        ');

        DB::unprepared('
            CREATE TRIGGER update_project_dates_after_delete
            AFTER DELETE ON project_irds
            FOR EACH ROW
            BEGIN
                CALL update_project_dates(OLD.project_id);
            END
        ');

        DB::unprepared('
            CREATE PROCEDURE update_project_dates(IN project_id BIGINT)
            BEGIN
                DECLARE max_received_date DATE;
                DECLARE all_received INT;

                -- Проверяем, все ли ИРД получены
                SELECT COUNT(*)
                INTO all_received
                FROM project_irds
                WHERE project_id = project_id
                AND receivedDate IS NULL;

                IF all_received = 0 THEN
                    -- Все ИРД получены, находим максимальную дату получения
                    SELECT MAX(receivedDate)
                    INTO max_received_date
                    FROM project_irds
                    WHERE project_id = project_id;

                    -- Обновляем даты начала и окончания проекта
                    UPDATE projects
                    SET date_signing = max_received_date,
                        date_end = DATE_ADD(max_received_date, INTERVAL duration DAY)
                    WHERE id = project_id;
                END IF;
            END
        ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        DB::unprepared('DROP TRIGGER IF EXISTS update_project_dates_after_insert');
        DB::unprepared('DROP TRIGGER IF EXISTS update_project_dates_after_update');
        DB::unprepared('DROP TRIGGER IF EXISTS update_project_dates_after_delete');
        DB::unprepared('DROP PROCEDURE IF EXISTS update_project_dates');
    }



};
