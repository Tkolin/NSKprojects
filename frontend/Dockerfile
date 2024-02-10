# Dockerfile для Front-End (ReactJs, AntD, Styled Components, Apollo Client)

# Используем официальный образ Node.js
FROM node:latest

# Настройка рабочей директории
WORKDIR /usr/src/app

# Копируем файлы проекта в контейнер
COPY . .

# Устанавливаем зависимости
RUN npm install

# Собираем React приложение
RUN npm run build

# Открываем порт для веб-сервера (по умолчанию 3000)
EXPOSE 3000

# Команда запуска веб-сервера React
CMD npm start
