FROM php:8.2-alpine

# Установка необходимых пакетов и зависимостей
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

# Установка Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Настройка рабочей директории
WORKDIR /var/www/html

# Копируем файлы проекта в контейнер
COPY . .

# Устанавливаем зависимости Laravel
# Устанавливаем зависимости Laravel
RUN composer install --no-dev

RUN composer require laravel/passport
# Создание директории для сохранения ключей OAuth
RUN composer require phpoffice/phpword

RUN php artisan optimize:clear

RUN php artisan vendor:publish --tag=passport-config
    # Открываем порт для веб-сервера (по умолчанию 8000)
EXPOSE 8000

# Команда запуска сервера Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0"]
