# Используем образ с PHP
FROM php:8.2-alpine

# Устанавливаем необходимые пакеты
RUN apk update && apk add --no-cache \
    curl \
    git \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql gd zip

# Устанавливаем Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Установка virtualenv
RUN pip3 install virtualenv

# Настройка рабочей директории
WORKDIR /var/www/html/backend

# Создание и активация виртуального окружения
RUN virtualenv venv
RUN . venv/Scripts/activate \
    && pip install --no-cache-dir -r requirements.txt

    # Копируем файлы проекта в контейнер
COPY . .

# Устанавливаем зависимости Laravel
RUN composer install --no-dev

# Устанавливаем библиотеку SymPy
RUN apk add --no-cache py3-pip
RUN pip3 install sympy

# Открываем порт для веб-сервера (по умолчанию 8000)
EXPOSE 8000

# Команда запуска сервера Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0"]
