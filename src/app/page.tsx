import Link from "next/link";

const fakeLeaders = [
  { rank: 1, name: "АнтонК", city: "Москва", profit: 312000, archetype: "🎯 Снайпер" },
  { rank: 2, name: "МашаФ", city: "Санкт-Петербург", profit: 287500, archetype: "💝 Маркетолог" },
  { rank: 3, name: "ДимаС", city: "Казань", profit: 251000, archetype: "♟️ Стратег" },
];

const steps = [
  { emoji: "1️⃣", title: "Выбери бизнес", desc: "Магазин или кафе — выбирай сценарий и открывай своё дело" },
  { emoji: "2️⃣", title: "Принимай решения", desc: "Цены, реклама, сотрудники — каждый месяц влияет на прибыль" },
  { emoji: "3️⃣", title: "Узнай свой архетип", desc: "Ты Визионер, Снайпер или Стратег? Получи персональный разбор" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center">
        <span className="mb-4 inline-block rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-1 text-sm font-medium text-indigo-300">
          Финансовая симуляция для школьников 11–18 лет
        </span>
        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Управляй бизнесом —
          </span>
          <br />
          побеждай в олимпиаде.
        </h1>
        <p className="mb-10 max-w-xl text-lg text-slate-400">
          Симуляция настоящего бизнеса для школьников. Принимай решения, зарабатывай прибыль, получи сертификат и узнай свой бизнес-архетип.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/play" className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-3 text-base font-bold text-white shadow-lg transition-opacity hover:opacity-90">
            Начать игру →
          </Link>
          <Link href="#how-it-works" className="rounded-xl border border-slate-700 px-8 py-3 text-base font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white">
            Как это работает ↓
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-slate-900/50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-extrabold text-white">Как это работает</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.title} className="rounded-2xl bg-slate-900 p-6 ring-1 ring-slate-800">
                <div className="mb-4 text-4xl">{s.emoji}</div>
                <h3 className="mb-2 text-lg font-bold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-extrabold text-white">Выбери сценарий</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-900 p-8 ring-1 ring-slate-800 transition-all hover:ring-indigo-500/50">
              <div className="mb-4 text-5xl">🛒</div>
              <h3 className="mb-2 text-xl font-bold text-white">Магазин</h3>
              <p className="mb-6 text-sm text-slate-400">Управляй продуктовым магазином в спальном районе. Закупки, цены, реклама — всё в твоих руках.</p>
              <Link href="/play" className="inline-block rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                Играть
              </Link>
            </div>
            <div className="rounded-2xl bg-slate-900 p-8 ring-1 ring-slate-800 transition-all hover:ring-violet-500/50">
              <div className="mb-4 text-5xl">☕</div>
              <h3 className="mb-2 text-xl font-bold text-white">Кафе</h3>
              <p className="mb-6 text-sm text-slate-400">Открой уютное кафе рядом со школой. Меню, персонал, атмосфера — строй клиентскую базу с нуля.</p>
              <Link href="/play" className="inline-block rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                Играть
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard teaser */}
      <section className="bg-slate-900/50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-12 text-center text-3xl font-extrabold text-white">Топ игроков</h2>
          <div className="mx-auto max-w-lg overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-800">
            {fakeLeaders.map((p, i) => (
              <div key={p.rank} className={`flex items-center justify-between px-6 py-4 ${i < fakeLeaders.length - 1 ? "border-b border-slate-800" : ""}`}>
                <div className="flex items-center gap-4">
                  <span className="w-8 text-center text-xl">{p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : "🥉"}</span>
                  <div>
                    <div className="font-semibold text-white">{p.name}</div>
                    <div className="text-xs text-slate-500">{p.city} · {p.archetype}</div>
                  </div>
                </div>
                <div className="font-bold text-emerald-400">+{p.profit.toLocaleString("ru")} ₽</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/leaderboard" className="inline-block rounded-lg border border-slate-700 px-6 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-indigo-500 hover:text-white">
              Полный рейтинг →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 py-10 text-center text-sm text-slate-500">
        <p className="mb-1 font-semibold text-slate-400">💹 ФинОлимп</p>
        <p>© 2025 Финансовая Олимпиада · Образовательный проект</p>
      </footer>
    </div>
  );
}
