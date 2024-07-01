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
        // Хранимая процедура
        DB::unprepared('
            CREATE PROCEDURE update_project_stages_dates(IN project_id BIGINT, IN date_difference INT)
            BEGIN
                UPDATE project_stages
                SET date_start = DATE_ADD(date_start, INTERVAL date_difference DAY),
                    date_end = DATE_ADD(date_end, INTERVAL date_difference DAY)
                WHERE project_id = project_id;
            END;
        ');

        // Триггер
        DB::unprepared('
            CREATE TRIGGER update_stages_on_project_date_update
            AFTER UPDATE ON projects
            FOR EACH ROW
            BEGIN
                DECLARE date_diff INT;

                IF OLD.date_signing != NEW.date_signing THEN
                    SET date_diff = DATEDIFF(NEW.date_signing, OLD.date_signing);
                    CALL update_project_stages_dates(NEW.id, date_diff);
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
            DROP TRIGGER IF EXISTS update_stages_on_project_date_update;
            DROP PROCEDURE IF EXISTS update_project_stages_dates;
        ');
    }
};
