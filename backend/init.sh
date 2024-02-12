#!/bin/bash

# Выполнение миграции
php artisan migrate

# Загрузка дампа данных
mysql -u username -p dbname < dump.sql
