# Используем образ с PHP
FROM php:8.3-alpine

# Устанавливаем необходимые пакеты
RUN apk update && apk add --no-cache \
    curl \
    git \
    unzip \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    py3-pip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql gd zip

# Устанавливаем Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Настройка рабочей директории
WORKDIR /app

# Копируем файлы проекта в контейнер
COPY . .

# Устанавливаем зависимости Laravel
RUN composer install --no-dev

# Открываем порт для веб-сервера (по умолчанию 8000)
EXPOSE 8000

# Команда запуска сервера Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0"]
