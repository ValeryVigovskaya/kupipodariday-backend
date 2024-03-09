<h1> Проект: КупиПодариДай </h1>

 Главная цель проекта - Разработка API для сервиса вишлистов.

# Реализованный функционал:
<ul>
  <li>Регистрация и авторизация</li>
  <li>Просмотр главной с лентой подарков</li>
  <li>Добавление или изменение подарков</li>
  <li>Просмотр информации о подарке (чужом или своём)</li>
  <li>Просмотр тематических подборок</li>
  <li>Редактирование профиля</li>
  <li>Просмотр профилей и «хотелок» других пользователей</li>
  <li>Просмотр главной с лентой подарков</li>
  <li>Поиск пользователей по имени пользователя или почте</li>
  <li>Заявка для желающих скинуться на подарок</li>
  <li>Копирование подарка</li>
</ul>

# Используемые технологии:
Основные технологии: Nest.js и TypeScript
  1. Создана новая база данных в PostgreSQL
  2. C помощью Nest CLI созданы основные компоненты и сущности
  3. Подключены и используются модули для работы с базой данных typeorm , @nestjs/typeorm и pg
  4. Используется модуль для хеширования паролей пользователей bcrypt и типы @types/bcrypt
  5. Passport.js и стратегии авторизации @nestjs/passport , passport, passport-jwt , passport-local, а также пакеты с типами для них: @types/passport-jwt, @types/passport-local
  6. Библиотеки валидации: class-validator и class-transformer;


# Инструкция по запуску:
Чтобы запустить проект понадобится несколько шагов:
1. Зайти в место, где будет запускаться проект: 
   `cd <название папки>`
2. Создать папку:
   `mkdir <название папки>`
3. Войти в папку:
   `cd <название папки>`
4. Клонируем репозиторий:
   `git clone https://github.com/ValeryVigovskaya/kupipodariday-backend.git`
5. Заходим в появившуюся папку:
   `cd kupipodariday-backend`
6. Устанавливаем все зависимости:
   `npm i или npm install`
7. Собрать проект можно по команде:
   `npm run build`
9. Запустить проект на локальном хосте можно по команде:
    `npm run start`
10. Через Postman можно проверить все существующие роуты

 ---
  :hammer_and_wrench: Используется :

 <div>
  <img src ="https://img.shields.io/badge/postgres-%23316192.svg?&style=for-the-badge&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/nestjs%20-%23E0234E.svg?&style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/typescript%20-%23007ACC.svg?&style=for-the-badge&logo=typescript&logoColor=white"/>
  
