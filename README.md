# Smart Table

Интерактивная таблица на JavaScript и Vite для просмотра записей продаж.  
Проект реализует загрузку данных с API, поиск, фильтрацию, сортировку и пагинацию без использования фреймворков.

Репозиторий: https://github.com/DefteEspero/smart-table

## Стек

- JavaScript ES Modules
- Vite
- HTML templates
- CSS
- REST API
- Fetch API

## Возможности

- Загрузка записей с удалённого API
- Загрузка справочников продавцов и покупателей
- Отображение данных в таблице
- Поиск по таблице
- Фильтрация записей по продавцу и сумме
- Сортировка по дате и итоговой сумме
- Пагинация с выбором количества строк на странице
- Переключение страниц: первая, предыдущая, следующая, последняя
- Отображение статуса пагинации: диапазон строк и общее количество записей
- Повторное использование HTML-шаблонов через `<template>`

## Запуск проекта

Установить зависимости:

```bash
npm install
```

Запустить проект в режиме разработки:

```bash
npm run dev
```

Собрать проект:

```bash
npm run build
```

Открыть собранную версию локально:

```bash
npm run preview
```

## API

Проект работает с удалённым API:

```txt
https://webinars.webdev.education-services.ru/sp7-api
```

Используемые эндпоинты:

```txt
GET /sellers
GET /customers
GET /records
```

Для запроса записей используются query-параметры:

```txt
limit=10
page=1
sort=total:up
filter[seller]=Seller Name
filter[totalFrom]=100
filter[totalTo]=1000
search=value
```

## Структура проекта

```txt
src/
  assets/
    *.svg
  components/
    filtering.js
    pagination.js
    searching.js
    sorting.js
    table.js
  data/
    dataset_1.js
    dataset_2.js
    dataset_3.js
  fonts/
    ys-display/
  lib/
    compare.js
    sort.js
    utils.js
  data.js
  main.js
  style.css
index.html
package.json
```

## Архитектура

Проект разделён на независимые модули:

- `main.js` — точка входа и координатор приложения;
- `data.js` — слой работы с API и преобразования данных;
- `components/table.js` — создание таблицы из HTML-шаблонов;
- `components/searching.js` — формирование параметров поиска;
- `components/filtering.js` — формирование параметров фильтрации;
- `components/sorting.js` — формирование параметров сортировки;
- `components/pagination.js` — формирование параметров пагинации и обновление UI;
- `lib/utils.js` — общие утилиты для шаблонов, форм и страниц;
- `lib/sort.js` — логика переключения состояний сортировки.

Основная идея архитектуры — каждый модуль отвечает за одну часть поведения таблицы.  
`main.js` собирает состояние формы, последовательно применяет поиск, фильтрацию, сортировку и пагинацию, затем запрашивает данные и обновляет таблицу.

## Основной поток работы

1. Приложение создаёт таблицу через `initTable()`.
2. Загружаются справочники через `api.getIndexes()`.
3. Справочники добавляются в поля фильтров.
4. При изменении формы вызывается `render()`.
5. `render()` собирает текущее состояние формы.
6. По состоянию формируется объект запроса.
7. Данные загружаются через `api.getRecords(query)`.
8. Таблица и пагинация обновляются актуальными данными.

Упрощённая схема:

```txt
Form state
  ↓
searching → filtering → sorting → pagination
  ↓
API query
  ↓
getRecords(query)
  ↓
render table + update pagination
```

## Основные модули

### `main.js`

Точка входа приложения.

Отвечает за:

- инициализацию API;
- создание таблицы;
- подключение поиска, фильтрации, сортировки и пагинации;
- сбор состояния формы;
- запуск перерисовки таблицы;
- добавление таблицы в DOM.

Ключевые функции:

```js
collectState()
render(action)
init()
```

### `data.js`

Слой работы с сервером.

Отвечает за:

- загрузку продавцов;
- загрузку покупателей;
- загрузку записей;
- преобразование серверных данных в формат таблицы;
- кеширование последнего запроса.

Публичный интерфейс:

```js
const api = initData();

api.getIndexes();
api.getRecords(query);
```

Формат строки таблицы после преобразования:

```js
{
  id: receipt_id,
  date: date,
  seller: sellers[seller_id],
  customer: customers[customer_id],
  total: total_amount
}
```

### `components/table.js`

Модуль создания и обновления таблицы.

Отвечает за:

- клонирование шаблонов таблицы;
- подключение блоков поиска, заголовка, фильтров и пагинации;
- обработку событий `change`, `reset` и `submit`;
- рендер строк таблицы.

Публичный интерфейс:

```js
const table = initTable(settings, onAction);

table.container;
table.elements;
table.render(data);
```

### `components/searching.js`

Модуль поиска.

Отвечает за добавление параметра `search` в объект запроса, если поле поиска заполнено.

Публичный интерфейс:

```js
const applySearching = initSearching('search');

query = applySearching(query, state);
```

### `components/filtering.js`

Модуль фильтрации.

Отвечает за:

- заполнение выпадающих списков справочниками;
- очистку отдельных фильтров;
- формирование query-параметров в формате `filter[field]`.

Публичный интерфейс:

```js
const { applyFiltering, updateIndexes } = initFiltering(elements);

updateIndexes(elements, indexes);
query = applyFiltering(query, state, action);
```

### `components/sorting.js`

Модуль сортировки.

Отвечает за переключение направления сортировки и добавление параметра `sort` в запрос.

Состояния сортировки:

```txt
none → up → down → none
```

Формат параметра сортировки:

```txt
field:direction
```

Пример:

```txt
total:up
date:down
```

### `components/pagination.js`

Модуль пагинации.

Отвечает за:

- добавление `limit` и `page` в объект запроса;
- обработку кнопок перехода по страницам;
- расчёт видимых номеров страниц;
- обновление статуса пагинации.

Публичный интерфейс:

```js
const { applyPagination, updatePagination } = initPagination(elements, createPage);

query = applyPagination(query, state, action);
updatePagination(total, query);
```

### `lib/utils.js`

Общие вспомогательные функции.

Содержит:

- `cloneTemplate(templateId)` — клонирует HTML-шаблон и собирает элементы с `data-name`;
- `processFormData(formData)` — преобразует `FormData` в обычный объект;
- `makeIndex(arr, field, val)` — создаёт объект-индекс по полю;
- `getPages(currentPage, maxPage, limit)` — рассчитывает список видимых страниц.

### `lib/sort.js`

Модуль вспомогательной сортировки.

Содержит:

- `sortMap` — карта переключения направления сортировки;
- `sortCollection(arr, field, order)` — сортировка коллекции по полю.

В текущей версии проекта основная сортировка выполняется на стороне API через query-параметр `sort`.

## Работа с шаблонами

В `index.html` используются HTML-шаблоны:

```txt
#search
#header
#filter
#table
#pagination
#row
```

Функция `cloneTemplate()` клонирует шаблон и собирает вложенные элементы с атрибутом `data-name`.

Пример:

```html
<div data-name="rows"></div>
```

После клонирования к элементу можно обратиться через:

```js
table.elements.rows
```

## Состояние приложения

В проекте нет отдельного глобального store.  
Актуальное состояние собирается из формы при каждом действии пользователя:

```js
const state = processFormData(new FormData(sampleTable.container));
```

После этого состояние нормализуется:

```js
const rowsPerPage = Number(state.rowsPerPage) || 10;
const page = Number(state.page) || 1;
```

Такой подход позволяет держать интерфейс и параметры запроса синхронизированными.

## Что отработано в проекте

В проекте отработаны:

- модульная структура приложения без фреймворков;
- работа с HTML-шаблонами;
- сбор состояния формы через `FormData`;
- построение query-параметров для API;
- асинхронная загрузка данных через `fetch`;
- пагинация серверных данных;
- сортировка через параметры API;
- фильтрация через параметры API;
- переиспользование UI-компонентов;
- разделение логики таблицы на независимые модули.