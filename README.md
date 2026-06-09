# FlowDesk Hub

> Простий SaaS для Instagram-магазинів — керуйте замовленнями без Excel.

## Швидкий старт

### 1. Встановити залежності

```bash
npm install
```

### 2. Налаштувати Supabase

Відкрий `src/App.jsx` і замін рядки у верхній частині файлу:

```js
const SUPABASE_URL = "SUPABASE_URL";               // ← вставити Project URL
const SUPABASE_PUBLISHABLE_KEY = "SUPABASE_PUBLISHABLE_KEY"; // ← вставити anon key
```

Значення знаходяться в **Supabase Dashboard → Project Settings → API**.

### 3. Створити таблицю в Supabase

Виконай у **SQL Editor** Supabase:

```sql
create table orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text,
  instagram text,
  phone text,
  product_name text,
  status text default 'Нове замовлення',
  tracking_number text,
  manager_comment text,
  created_at timestamptz default now()
);

-- Дозволити анонімний доступ (для MVP)
alter table orders enable row level security;
create policy "Allow all" on orders for all using (true) with check (true);
```

### 4. Запустити локально

```bash
npm run dev
```

Відкрий [http://localhost:5173](http://localhost:5173)

---

## Деплой на Vercel

### Варіант А — через Vercel CLI

```bash
npm run build
npx vercel --prod
```

### Варіант Б — через GitHub (рекомендовано)

1. Залий проєкт на GitHub
2. Зайди на [vercel.com](https://vercel.com) → **Add New Project**
3. Імпортуй репозиторій
4. Додай Environment Variables:
   - `VITE_SUPABASE_URL` = твій Project URL
   - `VITE_SUPABASE_ANON_KEY` = твій anon key
5. Натисни **Deploy**

> ⚠️ Якщо використовуєш env-змінні на Vercel, оновіть `src/App.jsx`:
> ```js
> const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
> const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
> ```

---

## Структура проєкту

```
flowdesk-hub/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          ← весь застосунок (Landing, TrackOrder, Dashboard)
│   ├── main.jsx         ← React entry point
│   └── index.css        ← Tailwind directives
├── .env.example         ← шаблон для env-змінних
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Технології

- **React 18** — UI
- **Tailwind CSS 3** — стилі
- **Supabase** — база даних (PostgreSQL + REST API)
- **Vite** — збірник
