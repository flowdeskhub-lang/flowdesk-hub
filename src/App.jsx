// ============================================================
// FlowDesk Hub — MVP
// ============================================================
// STEP 1: Replace the two placeholders below with your real
//         Supabase project values before running.
//
//   SUPABASE_URL          → Supabase Dashboard → Project Settings → API → Project URL
//   SUPABASE_PUBLISHABLE_KEY → Supabase Dashboard → Project Settings → API → anon / public key
//
// TIP: For production / Vercel deploy you can also use env variables:
//   Create a .env file in the project root:
//     VITE_SUPABASE_URL=https://xxxx.supabase.co
//     VITE_SUPABASE_ANON_KEY=eyJ...
//   Then replace the constants below with:
//     const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
//     const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase client ──────────────────────────────────────────
const SUPABASE_URL = "https://sjamgecolraqcexwotkf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_qXou1WgnN3jz2OnU0TXhlQ_UCLgFO15";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// ── Constants ────────────────────────────────────────────────
const STATUSES = [
  "Нове замовлення",
  "В обробці",
  "Готується до відправлення",
  "Відправлено",
  "Доставлено",
  "Скасовано",
];

const STATUS_STYLES = {
  "Нове замовлення":           "bg-sky-100 text-sky-700",
  "В обробці":                 "bg-amber-100 text-amber-700",
  "Готується до відправлення": "bg-violet-100 text-violet-700",
  "Відправлено":               "bg-blue-100 text-blue-700",
  "Доставлено":                "bg-emerald-100 text-emerald-700",
  "Скасовано":                 "bg-rose-100 text-rose-700",
};

const EMPTY_FORM = {
  customer_name: "",
  instagram: "",
  phone: "",
  product_name: "",
amount: "",
cost: "",
status: "Нове замовлення",
  tracking_number: "",
  manager_comment: "",
};

// ── Helpers ──────────────────────────────────────────────────
function fmt(dateStr) {
  if (!dateStr) return "—";

  return new Date(dateStr).toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function money(value) {
  const n = Number(value || 0);
  return n.toLocaleString("uk-UA") + " грн";
}

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {status}
    </span>
  );
}

// ============================================================
// LANDING PAGE
// ============================================================
function Landing({ onDash, onTrack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-indigo-900 to-purple-900 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-400 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight">FlowDesk Hub</span>
        </div>
        <div className="flex gap-3">
          <button onClick={onTrack}
            className="text-sm text-indigo-200 hover:text-white transition-colors px-3 py-2">
            Відстежити замовлення
          </button>
          <button onClick={onDash}
            className="text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 transition-colors">
            Панель керування
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-800/60 border border-indigo-600/40 rounded-full px-4 py-1.5 text-sm text-indigo-200 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Простий SaaS для Instagram-магазинів
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
          Керуйте замовленнями<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
            з Instagram без Excel
          </span>
        </h1>

        <p className="text-xl text-indigo-200 leading-relaxed max-w-2xl mx-auto mb-10">
          Додавайте замовлення, оновлюйте статуси та дайте клієнтам змогу самостійно перевіряти доставку.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onDash}
            className="bg-indigo-400 hover:bg-indigo-300 text-indigo-950 font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-900/50 text-base">
            Спробувати безкоштовно
          </button>
          <button onClick={onTrack}
            className="border border-white/25 hover:bg-white/10 text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-base">
            Перевірити замовлення
          </button>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-24 text-left">
          {[
            { icon: "📦", title: "Всі замовлення в одному місці", body: "Більше не потрібні таблиці Excel — керуйте всім з одного зручного дашборду." },
            { icon: "🔍", title: "Відстеження для клієнта", body: "Клієнт перевіряє статус за ніком Instagram або номером телефону — без реєстрації." },
            { icon: "⚡", title: "Швидке оновлення статусів", body: "Змінюйте статус замовлення одним кліком прямо в таблиці замовлень." },
          ].map(f => (
            <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-colors">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-semibold text-white mb-2">{f.title}</div>
              <div className="text-sm text-indigo-300 leading-relaxed">{f.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CUSTOMER TRACKING SECTION
// ============================================================
function TrackOrder({ onBack }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setResults(null);

    const { data, error: err } = await supabase
      .from("orders")
      .select("*")
      .or(`instagram.ilike.%${q}%,phone.ilike.%${q}%`);

    setLoading(false);
    if (err) { setError("Помилка пошуку. Перевірте підключення до Supabase."); return; }
    setResults(data || []);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="font-bold text-indigo-700 text-base">FlowDesk Hub</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Відстежити замовлення</h2>
        <p className="text-gray-500 mb-8">Введіть ваш Instagram або номер телефону для перевірки статусу.</p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Instagram або номер телефону"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
          />
          <button type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm text-sm whitespace-nowrap">
            {loading ? "Шукаємо…" : "Перевірити"}
          </button>
        </form>

        {error && <p className="text-rose-500 text-sm mb-6">{error}</p>}

        {results !== null && results.length === 0 && (
          <div className="text-center py-14 text-gray-400">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium">Замовлень не знайдено.</p>
            <p className="text-sm mt-1">Перевірте правильність введених даних.</p>
          </div>
        )}

        {results && results.map(order => (
          <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-6 mb-4 shadow-sm">
            <div className="flex items-start justify-between mb-4 gap-4">
              <div>
                <p className="font-bold text-gray-900 text-lg">{order.customer_name}</p>
                <p className="text-sm text-gray-400 mt-0.5">{fmt(order.created_at)}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">Товар</span>
                <span className="text-gray-800 font-medium">{order.product_name || "—"}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">Трек-номер</span>
                <span className="text-gray-800 font-medium font-mono">{order.tracking_number || "—"}</span>
              </div>
              {order.manager_comment && (
                <div className="col-span-2">
                  <span className="text-gray-400 block text-xs uppercase tracking-wide mb-0.5">Коментар менеджера</span>
                  <span className="text-gray-700">{order.manager_comment}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ADD / EDIT ORDER MODAL
// ============================================================
function OrderModal({ order, onClose, onSaved }) {
  const [form, setForm] = useState(order ? { ...order } : { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.customer_name.trim() || !form.product_name.trim()) {
      setErr("Заповніть імʼя клієнта та назву товару."); return;
    }
    setSaving(true); setErr("");
    let result;
    if (order?.id) {
      result = await supabase.from("orders").update(form).eq("id", order.id).select().single();
    } else {
  // eslint-disable-next-line no-unused-vars
const { id, ...payload } = form;

payload.user_id = (await supabase.auth.getUser()).data.user?.id;

result = await supabase
  .from("orders")
  .insert(payload)
  .select()
  .single();
    }
    setSaving(false);
    if (result.error) { setErr("Помилка збереження: " + result.error.message); return; }
    onSaved(result.data);
  }

  const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">
            {order?.id ? "Редагувати замовлення" : "Нове замовлення"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className={labelCls}>Імʼя клієнта *</label>
              <input className={inputCls} placeholder="Анна Коваль"
                value={form.customer_name} onChange={e => set("customer_name", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Instagram</label>
              <input className={inputCls} placeholder="@username"
                value={form.instagram} onChange={e => set("instagram", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Телефон</label>
              <input className={inputCls} placeholder="+380501234567"
                value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Назва товару *</label>
              <input className={inputCls} placeholder="Сукня літня, розмір S"
                value={form.product_name} onChange={e => set("product_name", e.target.value)} />
            </div>
            <div>
  <label className={labelCls}>Сума продажу</label>
  <input
    type="number"
    className={inputCls}
    placeholder="1500"
    value={form.amount}
    onChange={e => set("amount", e.target.value)}
  />
</div>

<div>
  <label className={labelCls}>Собівартість</label>
  <input
    type="number"
    className={inputCls}
    placeholder="900"
    value={form.cost}
    onChange={e => set("cost", e.target.value)}
  />
</div>
            <div>
              <label className={labelCls}>Статус</label>
              <select className={inputCls} value={form.status} onChange={e => set("status", e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Трек-номер</label>
              <input className={inputCls} placeholder="59000123456789"
                value={form.tracking_number} onChange={e => set("tracking_number", e.target.value)} />
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Коментар менеджера</label>
              <textarea className={inputCls + " resize-none"} rows={3}
                placeholder="Внутрішні нотатки…"
                value={form.manager_comment} onChange={e => set("manager_comment", e.target.value)} />
            </div>
          </div>

          {err && <p className="text-rose-500 text-sm">{err}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Скасувати
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors">
              {saving ? "Зберігаємо…" : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard({ onBack, onLogout, session }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Усі");
  const [modal, setModal] = useState(null); // null | "new" | order object
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
const totalRevenue = orders.reduce(
  (sum, order) => sum + Number(order.amount || 0),
  0
);

const totalCost = orders.reduce(
  (sum, order) => sum + Number(order.cost || 0),
  0
);

const totalProfit = totalRevenue - totalCost;
  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
  .from("orders")
  .select("*")
  .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
  .order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleStatusChange(id, newStatus) {
    setUpdatingId(id);
    await supabase.from("orders").update({ status: newStatus }).eq("id", id);
    setOrders(o => o.map(x => x.id === id ? { ...x, status: newStatus } : x));
    setUpdatingId(null);
  }

  async function handleDelete(id) {
    await supabase.from("orders").delete().eq("id", id);
    setOrders(o => o.filter(x => x.id !== id));
    setDeleteId(null);
  }

  function handleSaved(saved) {
    setOrders(prev => {
      const exists = prev.find(x => x.id === saved.id);
      return exists
        ? prev.map(x => x.id === saved.id ? saved : x)
        : [saved, ...prev];
    });
    setModal(null);
  }

  const visible = orders.filter(o => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.instagram?.toLowerCase().includes(q) ||
      o.phone?.includes(q) ||
      o.product_name?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Усі" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length; return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 bg-indigo-950 text-white shrink-0">
        <button
  onClick={onBack}
 className="px-6 py-6 flex items-center gap-3 hover:opacity-80 transition-opacity"
  <div>
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"
      />
    </svg>
  </div>

  <span className="font-bold text-sm">
    FlowDesk Hub
  </span>
</button>
          <nav className="flex-1 px-3 py-4 space-y-1">
            <div className="px-3 py-2 rounded-lg bg-indigo-800 text-sm font-semibold text-white flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              Замовлення
            </div>
          </nav>
          <div className="px-3 pb-4">
  <button
    onClick={onLogout}
    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-300 hover:text-white hover:bg-red-700 text-sm transition-colors"
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h5a2 2 0 012 2v1"
      />
    </svg>
    Вийти
  </button>
</div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="md:hidden text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <h1 className="font-bold text-gray-900 text-xl">Замовлення</h1>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {orders.length}
              </span>
            </div>
            <button onClick={() => setModal("new")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
              </svg>
              <span className="hidden sm:inline">Нове замовлення</span>
              <span className="sm:hidden">Нове</span>
            </button>
          </div>

          <div className="px-6 py-6">
            {/* Stats strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
  <div className="bg-white border rounded-xl px-4 py-3 shadow-sm">
    <p className="text-2xl font-extrabold text-gray-900">
      {money(totalRevenue)}
    </p>
    <p className="text-xs text-gray-400">Оборот</p>
  </div>

  <div className="bg-white border rounded-xl px-4 py-3 shadow-sm">
    <p className="text-2xl font-extrabold text-gray-900">
      {money(totalCost)}
    </p>
    <p className="text-xs text-gray-400">Витрати</p>
  </div>

  <div className="bg-white border rounded-xl px-4 py-3 shadow-sm">
    <p className="text-2xl font-extrabold text-green-600">
      {money(totalProfit)}
    </p>
    <p className="text-xs text-gray-400">Прибуток</p>
  </div>
</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {STATUSES.map(s => (
                <div key={s}
                  className={`bg-white border rounded-xl px-4 py-3 shadow-sm cursor-pointer transition-colors ${filterStatus === s ? "border-indigo-400 ring-2 ring-indigo-200" : "border-gray-100 hover:border-indigo-200"}`}
                  onClick={() => setFilterStatus(s === filterStatus ? "Усі" : s)}>
                  <p className="text-2xl font-extrabold text-gray-900">{counts[s] || 0}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{s}</p>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Пошук за імʼям, Instagram, товаром…"
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[200px]">
                <option value="Усі">Усі статуси</option>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Orders table */}
            {loading ? (
              <div className="flex items-center justify-center py-24 text-gray-400">
                <svg className="w-6 h-6 animate-spin mr-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Завантаження…
              </div>
            ) : visible.length === 0 ? (
              <div className="text-center py-24 text-gray-400">
                <div className="text-5xl mb-4">📋</div>
                <p className="font-semibold text-gray-500 text-lg">Замовлень поки немає</p>
                <p className="text-sm mt-1">Натисніть «Нове замовлення», щоб розпочати.</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                        <th className="text-left px-5 py-3 font-semibold">Клієнт</th>
                        <th className="text-left px-5 py-3 font-semibold">Товар</th>
                        <th className="text-left px-5 py-3 font-semibold">Статус</th>
                        <th className="text-left px-5 py-3 font-semibold">Трек-номер</th>
                        <th className="text-left px-5 py-3 font-semibold">Дата</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((o, i) => (
                        <tr key={o.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === visible.length - 1 ? "border-0" : ""}`}>
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-gray-900">{o.customer_name}</p>
                            <p className="text-gray-400 text-xs mt-0.5">{o.instagram || o.phone || "—"}</p>
                          </td>
                          <td className="px-5 py-3.5 text-gray-700">{o.product_name}</td>
                          <td className="px-5 py-3.5">
                            <select
                              value={o.status}
                              disabled={updatingId === o.id}
                              onChange={e => handleStatusChange(o.id, e.target.value)}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer disabled:opacity-50">
                              {STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-gray-600 text-xs">{o.tracking_number || "—"}</td>
                          <td className="px-5 py-3.5 text-gray-400 text-xs">{fmt(o.created_at)}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setModal(o)}
                                className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                              </button>
                              <button onClick={() => setDeleteId(o.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="lg:hidden space-y-3">
                  {visible.map(o => (
                    <div key={o.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-3 gap-3">
                        <div>
                          <p className="font-bold text-gray-900">{o.customer_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{o.instagram || o.phone || "—"}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setModal(o)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          <button onClick={() => setDeleteId(o.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-gray-400 hover:text-rose-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{o.product_name}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <select
                          value={o.status}
                          disabled={updatingId === o.id}
                          onChange={e => handleStatusChange(o.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50">
                          {STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                        {o.tracking_number && (
                          <span className="text-xs font-mono text-gray-500">{o.tracking_number}</span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">{fmt(o.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit modal */}
      {modal && (
        <OrderModal
          order={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Видалити замовлення?</h3>
            <p className="text-gray-500 text-sm mb-6">Цю дію неможливо скасувати.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Скасувати
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white rounded-xl py-2.5 text-sm font-semibold">
                Видалити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// APP ROOT — routing between pages
// ============================================================
export default function App() {
  const [page, setPage] = useState("landing");
  const [session, setSession] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);

        if (session) {
          setPage("dashboard");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleAuth(e) {
    e.preventDefault();
    setAuthError("");

    const result =
      authMode === "login"
        ? await supabase.auth.signInWithPassword({
            email,
            password,
          })
        : await supabase.auth.signUp({
            email,
            password,
          });

    if (result.error) {
      setAuthError(result.error.message);
      return;
    }

    if (authMode === "signup") {
      setAuthMode("login");
      setAuthError("Акаунт створено. Тепер увійдіть.");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setPage("landing");
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Завантаження...
      </div>
    );
  }

  if (page === "track") {
    return <TrackOrder onBack={() => setPage("landing")} />;
  }

  if (page === "dashboard") {
    if (!session) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <form
            onSubmit={handleAuth}
            className="w-full max-w-md bg-white rounded-2xl shadow-sm border p-6"
          >
            <h1 className="text-2xl font-bold mb-2">
              {authMode === "login"
                ? "Вхід до FlowDesk Hub"
                : "Реєстрація"}
            </h1>

            <p className="text-sm text-gray-500 mb-5">
              {authMode === "login"
                ? "Увійдіть, щоб керувати замовленнями."
                : "Створіть акаунт."}
            </p>

            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Email
            </label>

            <input
              type="email"
              className="w-full border rounded-xl px-3 py-2 mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="block text-xs font-semibold text-gray-500 mb-1">
              Пароль
            </label>

            <input
              type="password"
              className="w-full border rounded-xl px-3 py-2 mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {authError && (
              <p className="text-sm text-red-500 mb-3">
                {authError}
              </p>
            )}

            <button className="w-full bg-indigo-600 text-white rounded-xl py-2.5 font-semibold">
              {authMode === "login"
                ? "Увійти"
                : "Зареєструватися"}
            </button>

            <button
              type="button"
              onClick={() =>
                setAuthMode(
                  authMode === "login" ? "signup" : "login"
                )
              }
              className="w-full mt-3 text-sm text-indigo-600"
            >
              {authMode === "login"
                ? "Немає акаунта? Зареєструватися"
                : "Вже є акаунт? Увійти"}
            </button>
          </form>
        </div>
      );
    }

    return (
      <Dashboard
        onBack={() => setPage("landing")}
        onLogout={handleLogout}
        session={session}
      />
    );
  }

  return (
    <Landing
      onDash={() => setPage("dashboard")}
      onTrack={() => setPage("track")}
    />
  );
}
