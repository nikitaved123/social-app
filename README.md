# Social App - инструкция запуска

## Скопируй и вставь команды по порядку:

```bash
# 1. Установка бэкенда
cd backend
npm install
npm install --save-dev @types/node

# 2. Создание .env файла
echo 'DATABASE_URL="postgresql://postgres:password@localhost:5432/social_app"' > .env
echo 'PORT=3000' >> .env
echo 'JWT_SECRET="your-secret-key"' >> .env

# 3. Настройка Prisma
npx prisma generate
npx prisma migrate dev --name init

# 4. Запуск бэкенда
npm run dev
Открой новый терминал (Ctrl+Shift+T) и вставь:

bash
# 5. Установка фронтенда
cd ..
npm install

# 6. Запуск фронтенда
npm run dev
Готово! Открой в браузере:
Фронтенд: http://localhost:5173

Бэкенд: http://localhost:3000
