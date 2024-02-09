# Используем образ Node.js
FROM node:14

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем зависимости package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения в контейнер
COPY . .

# Собираем приложение
RUN npm run build

# Запускаем приложение при старте контейнера
CMD ["npm", "start"]
