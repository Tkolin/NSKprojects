# Используем образ PHP с Apache
FROM php:8.2-apache

# Устанавливаем необходимые расширения PHP
RUN docker-php-ext-install pdo pdo_mysql

# Устанавливаем Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Копируем исходный код приложения в контейнер
COPY . /var/www/html

# Устанавливаем рабочую директорию
WORKDIR /var/www/html

# Запускаем Apache в фоновом режиме
CMD ["apache2-foreground"]
