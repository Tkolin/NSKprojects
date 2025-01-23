import os
import csv
from sqlalchemy import create_engine, inspect

# Настройки подключения к базе данных
DB_URL = "mysql+pymysql://root:root@localhost:3306/sibnipi"
EXPORT_FOLDER = "exported_csv"

# Создание подключения к базе данных
engine = create_engine(DB_URL)

# Функция для экспорта таблицы в CSV
def export_table_to_csv(engine, table_name, output_folder):
    with engine.connect() as connection:
        result = connection.execute(f"SELECT * FROM {table_name}")
        columns = result.keys()

        # Создание папки для экспорта, если её нет
        os.makedirs(output_folder, exist_ok=True)
        file_path = os.path.join(output_folder, f"{table_name}.csv")

        with open(file_path, mode="w", encoding="utf-8", newline="") as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(columns)  # Запись заголовков столбцов
            writer.writerows(result.fetchall())  # Запись данных

        print(f"Таблица {table_name} экспортирована в {file_path}.")

# Основной скрипт для экспорта всей базы данных
def export_database_to_csv(engine, output_folder):
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    print(f"Найдено {len(tables)} таблиц: {', '.join(tables)}")

    for table in tables:
        print(f"Экспорт таблицы {table}...")
        export_table_to_csv(engine, table, output_folder)

    print(f"Экспорт завершен. Все таблицы сохранены в папке {output_folder}.")

if __name__ == "__main__":
    export_database_to_csv(engine, EXPORT_FOLDER)
