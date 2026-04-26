"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const CITIES = ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань", "Нижний Новгород", "Челябинск", "Самара", "Уфа", "Ростов-на-Дону", "Другой"];

export default function OnboardingPage() {
  const { update } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (nickname.trim().length < 2) { setError("Никнейм должен быть не менее 2 символов"); return; }
    const ageNum = Number(age);
    if (!age || ageNum < 8 || ageNum > 100) { setError("Укажи корректный возраст (8–100)"); return; }
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!city) { setError("Выбери город"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname.trim(), age: Number(age), city }),
      });
      if (!res.ok) throw new Error("Ошибка сохранения");
      await update();
      router.push("/play");
    } catch {
      setError("Что-то пошло не так. Попробуй ещё раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 ring-1 ring-slate-800 shadow-2xl">
        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-2">
          {[1, 2].map((n) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${step >= n ? "bg-linear-to-br from-indigo-600 to-violet-600 text-white" : "bg-slate-800 text-slate-500"}`}>
                {n}
              </div>
              {n < 2 && <div className={`h-0.5 w-12 rounded-full transition-colors ${step > n ? "bg-indigo-500" : "bg-slate-800"}`} />}
            </div>
          ))}
          <span className="ml-auto text-xs text-slate-500">Шаг {step} из 2</span>
        </div>

        {step === 1 ? (
          <>
            <h1 className="mb-1 text-2xl font-extrabold text-white">Расскажи о себе</h1>
            <p className="mb-6 text-sm text-slate-400">Придумай никнейм и укажи возраст</p>
            <form onSubmit={handleStep1} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Никнейм</label>
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="например, ФинансовыйГуру" maxLength={32}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Возраст</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="например, 15" min={8} max={100}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button type="submit" className="mt-2 w-full rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity">
                Далее →
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mb-1 text-2xl font-extrabold text-white">Откуда ты?</h1>
            <p className="mb-6 text-sm text-slate-400">Выбери свой город</p>
            <form onSubmit={handleStep2} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CITIES.map((c) => (
                  <button key={c} type="button" onClick={() => setCity(c)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${city === c ? "border-indigo-500 bg-indigo-600/20 text-indigo-300" : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"}`}>
                    {c}
                  </button>
                ))}
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="mt-2 flex gap-3">
                <button type="button" onClick={() => { setStep(1); setError(""); }}
                  className="flex-1 rounded-xl border border-slate-700 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 transition-colors">
                  ← Назад
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 py-3 text-sm font-bold text-white hover:opacity-90 disabled:opacity-60 transition-opacity">
                  {loading ? "Сохранение..." : "Начать игру"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
