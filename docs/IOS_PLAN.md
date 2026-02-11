# План по превращению валентинки в iOS‑приложение

Подробный пошаговый план от текущего состояния до приложения в App Store.

---

## Что уже сделано ✅

- [x] Capacitor установлен и сконфигурирован
- [x] Платформа iOS добавлена (`ios/` папка)
- [x] Скрипты в package.json (`build:ios`, `cap:sync`, `ios`)
- [x] Base path настроен для работы в нативном приложении

---

## Этап 1. Подготовка (на Mac)

### 1.1 Установить Xcode

1. Открой **App Store** на Mac
2. Найди **Xcode**, установи (≈12 ГБ, бесплатно)
3. После установки открой Xcode один раз — дождись установки дополнительных компонентов
4. Прими лицензию, если попросит

### 1.2 Apple ID (для симулятора — можно без платного аккаунта)

- Зайди в **Системные настройки → Apple ID**
- Убедись, что залогинен

Для запуска на **симуляторе** — Apple ID достаточно.

Для запуска на **реальном iPhone** и **App Store** — нужен **Apple Developer Program** ($99/год).

---

## Этап 2. Первый запуск на симуляторе

### 2.1 Подготовка контента

1. Положи фото в `public/photos/`:
   - `photo-1.png`, `photo-2.png`, … `photo-6.png`
   - `apple-face.png` (если используешь)

2. Проверь тексты в `src/app/config.ts` (имена, дата, подпись)

### 2.2 Сборка и запуск

```bash
cd valentine
npm run ios
```

Откроется Xcode. Далее:

1. В верхней панели выбери **симулятор** (например, iPhone 16)
2. Нажми **Run** (▶) или `Cmd + R`
3. Подожди сборки (1–3 минуты в первый раз)

Приложение запустится в симуляторе.

### 2.3 Если сборка падает

- **Signing error** — в Xcode: **Signing & Capabilities** → выбери свою команду (Team) или **Add Account** и войди по Apple ID
- **No such module** — `File → Packages → Resolve Package Versions`
- Другие ошибки — скопируй текст ошибки и поищи в Google или спроси в чате

---

## Этап 3. Запуск на реальном iPhone

### 3.1 Подключить iPhone

1. Подключи iPhone по USB
2. Разблокируй телефон и нажми **Доверять** на всплывшем диалоге

### 3.2 Настройка подписи в Xcode

1. В левой панели выбери проект **App**
2. Вкладка **Signing & Capabilities**
3. В **Team** выбери свой Apple ID (или создай **Add Account**)
4. Xcode создаст бесплатный provisioning profile (для разработки на своём устройстве)

### 3.3 Выбор устройства и запуск

1. В верхней панели Xcode вместо симулятора выбери **свой iPhone**
2. Нажми **Run** (▶)
3. На iPhone: **Настройки → Основные → VPN и управление устройством** → доверь профилю разработчика
4. Запусти приложение снова из Xcode

---

## Этап 4. Публикация в App Store

> Нужен платный **Apple Developer Program** ($99/год): https://developer.apple.com/programs/

### 4.1 Аккаунт разработчика

1. Зарегистрируйся в [Apple Developer](https://developer.apple.com)
2. Оплати годовую подписку
3. Подожди одобрения (обычно 1–2 дня)

### 4.2 Настройка в Xcode

1. **Signing & Capabilities** → Team: выбери свою команду разработчика
2. **Bundle Identifier**: убедись, что уникальный (например, `com.kirillkorotkov.valentine`)

### 4.3 Иконка приложения

1. Нужна иконка 1024×1024 px (без прозрачности, без скруглений)
2. В Xcode: **App → Assets.xcassets → AppIcon**
3. Перетащи туда изображение 1024×1024

### 4.4 Скриншоты для App Store

Нужны скриншоты для разных размеров iPhone (минимум 6.7", 6.5", 5.5"):

- Запусти приложение в симуляторе
- `Cmd + S` — сохранить скриншот
- Или используй инструменты Apple: [App Store Connect](https://appstoreconnect.apple.com)

### 4.5 Создание приложения в App Store Connect

1. Зайди на [App Store Connect](https://appstoreconnect.apple.com)
2. **My Apps** → **+** → **New App**
3. Заполни:
   - **Platform**: iOS
   - **Name**: Валентинка
   - **Primary Language**: Russian
   - **Bundle ID**: выбери зарегистрированный
   - **SKU**: любой уникальный идентификатор

### 4.6 Архивирование и загрузка

1. В Xcode выбери **Any iOS Device**
2. **Product → Archive**
3. После архива откроется **Organizer**
4. **Distribute App** → **App Store Connect** → **Upload**
5. Подожди обработки (10–30 минут)

### 4.7 Отправка на модерацию

1. В App Store Connect открой своё приложение
2. Заполни описание, ключевые слова, категорию
3. Добавь скриншоты
4. Выбери билд из загруженных
5. **Submit for Review**

Модерация обычно занимает 1–3 дня.

---

## Этап 5. Дальнейшая разработка

### 5.1 Внесение изменений в код

1. Редактируй файлы в `src/`
2. После изменений:
   ```bash
   npm run build:ios
   npm run cap:sync
   ```
3. В Xcode нажми **Run** (▶) — приложение перезапустится с новым кодом

### 5.2 Live reload (опционально)

Для мгновенного обновления без пересборки:

1. Запусти веб‑сервер: `npm run dev`
2. В `capacitor.config.json` добавь:
   ```json
   "server": {
     "url": "http://ТВОЙ_IP:5173",
     "cleartext": true
   }
   ```
3. В Xcode запусти приложение — оно будет грузить страницу с твоего компьютера
4. После отладки верни конфиг и снова собери `dist`

### 5.3 Нативные функции (если понадобятся)

Capacitor позволяет подключать плагины:

- **Камера** — `@capacitor/camera`
- **Файлы** — `@capacitor/filesystem`
- **Шейринг** — `@capacitor/share`
- **Haptic feedback** — `@capacitor/haptics`

Устанавливай через `npm install @capacitor/...` и `npx cap sync`.

---

## Чеклист перед релизом

- [ ] Все фото лежат в `public/photos/`
- [ ] Тексты в config.ts актуальны
- [ ] Иконка 1024×1024 добавлена
- [ ] Приложение проверено на нескольких размерах экрана
- [ ] Нет крашей и серьёзных багов
- [ ] Описание и скриншоты подготовлены для App Store Connect

---

## Полезные ссылки

- [Capacitor iOS Docs](https://capacitorjs.com/docs/ios)
- [Apple Developer Program](https://developer.apple.com/programs/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
