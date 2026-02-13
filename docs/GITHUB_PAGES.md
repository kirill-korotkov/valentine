# GitHub Pages — инструкция

## Шаг 1. Запусти первый деплой

1. Сделай пуш изменений в `main` (или нажми **Actions** → **Deploy to GitHub Pages** → **Run workflow**)
2. Дождись зелёной галочки — workflow создаст ветку `gh-pages` и зальёт туда собранный сайт

## Шаг 2. Включи GitHub Pages

1. Открой **https://github.com/kirill-korotkov/valentine/settings/pages**
2. В блоке **Build and deployment**:
   - **Source**: выбери **Deploy from a branch**
   - **Branch**: выбери **gh-pages** и папку **/ (root)**
   - Сохрани (Save)

## Шаг 3. Деплой

Сайт автоматически деплоится при каждом пуше в ветку `main`.

Или можно запустить деплой вручную:
1. Вкладка **Actions**
2. Слева выбери workflow **Deploy to GitHub Pages**
3. Нажми **Run workflow** → **Run workflow**

## Шаг 4. Адрес приложения

После успешного деплоя сайт будет доступен по адресу:

**https://kirill-korotkov.github.io/valentine/**

(Подставь свой username, если репозиторий под другим аккаунтом.)

## Шаг 5. Проверка

1. Открой ссылку в браузере
2. Пройди карусель → нажми «Да» → откроется главное меню
3. Должна быть кнопка **«Синхронизация»** — значит API подключён

## Если workflow падает с ошибкой

1. Открой **Actions** → **Deploy to GitHub Pages** → нажми на упавший запуск (красный крестик)
2. Посмотри, **на каком шаге** упал запуск:
   - **Install dependencies** — значит `package-lock.json` не закоммичен или сломан
   - **Build** — ошибка при сборке (открой логи шага, там будет сообщение Vite/TypeScript)
   - **Deploy to GitHub Pages** — проверь права: **Settings** → **Actions** → **General** → **Workflow permissions** → выбери **Read and write permissions**

## Если что-то не работает

### Кнопка «Синхронизация» не появляется
- Проверь, что workflow завершился без ошибок: **Actions** → последний запуск
- Убедись, что в workflow есть `VITE_API_URL` при сборке (уже настроено в `.github/workflows/deploy.yml`)

### Ошибка 404 при открытии страницы
- Проверь **Settings** → **Pages** → Source = **Deploy from a branch**, Branch = **gh-pages**
- Подожди 2–3 минуты после первого деплоя

### Синхронизация не работает (комната не создаётся)
- Бэкенд на Render мог «заснуть» (Free tier) — подожди 30–60 сек и попробуй снова
- Открой DevTools (F12) → вкладка **Network** → посмотри, уходят ли запросы на `backend-for-render-valentine.onrender.com`

## Изменение URL бэкенда

Если бэкенд переехал, поменяй `VITE_API_URL` в файле `.github/workflows/deploy.yml` (строка 36) и сделай пуш в `main`.
