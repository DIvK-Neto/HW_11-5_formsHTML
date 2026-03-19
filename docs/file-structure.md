# Структура проекта

```t
    HW_11-5_formsHTML/
    ├── .github/
    │   └── workflows/
    │       └── ci.yml                          # Конфигурация GitHub Actions (CI/CD)
    ├── docs/                                   # Документация проекта
    │   ├── features.md                         # Функциональность виджета
    │   ├── installation.md                     # Установка и запуск
    │   ├── tech-stack.md                       # Используемые технологии
    │   ├── testing.md                          # Тестирование
    │   └── file-structure.md                   # Этот файл
    ├── e2e/                                    # Сквозные тесты (Puppeteer)
    │   └── popover.e2e.test.js                 # E2E-тесты для виджета
    ├── src/                                    # Исходный код
    │   ├── css/                                # Стили
    │   │   ├── global.css                      # Глобальные стили (body, кнопки)
    │   │   └── popover.css                     # Стили для попапа
    │   ├── js/                                 # JavaScript
    │   │   ├── components/                     # Компоненты
    │   │   │   └── popover/                    # Компонент Popover
    │   │   │       ├── __tests__/              # Модульные тесты
    │   │   │       │   └── popover.test.js     # Тесты класса Popover
    │   │   │       └── popover.js              # Класс Popover
    │   │   └── app.js                          # Инициализация виджета
    │   ├── index.html                          # Главная HTML-страница (пример кнопок)
    │   └── index.js                            # Точка входа (импорт стилей и app.js)
    ├── .babelrc                                # Настройки Babel
    ├── .eslintrc.js                            # Конфигурация ESLint
    ├── .gitignore                              # Игнорируемые файлы
    ├── .prettierrc                             # Настройки Prettier
    ├── jest.config.js                          # Конфигурация Jest
    ├── package-lock.json                       # Lock-файл зависимостей
    ├── package.json                            # Зависимости и скрипты
    ├── README.md                               # Основной файл документации
    └── webpack.*.js (common, dev, prod)        # Конфигурации Webpack
```

## Описание ключевых модулей

- **`src/js/components/popover/`** – код виджета Popover: класс, логика показа/скрытия, позиционирование.
- **`src/js/app.js`** – инициализация виджета на странице.
- **`src/css/`** – стили: глобальные и специфичные для компонента.
- **`e2e/`** – сквозные тесты с Puppeteer для проверки работы в браузере.
- **`docs/`** – подробная документация по проекту.
