"use client";
import { signIn } from "next-auth/react";
import { useState, type FormEvent } from "react";

export default function SignInPage() {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (trimmed.length < 2) {
      setError("Никнейм должен быть не короче 2 символов");
      return;
    }
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      nickname: trimmed,
      callbackUrl: "/onboarding",
      redirect: true,
    });
    if (res?.error) {
      setError("Что-то пошло не так, попробуй ещё раз");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-8 ring-1 ring-slate-800 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">💹</div>
          <h1 className="text-2xl font-extrabold text-white">Войти в ФинОлимп</h1>
          <p className="mt-2 text-sm text-slate-400">Придумай никнейм чтобы начать</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Твой никнейм"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={32}
            className="w-full rounded-xl bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 ring-1 ring-slate-700 focus:outline-none focus:ring-indigo-500"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || nickname.trim().length < 2}
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Входим..." : "Продолжить →"}
          </button>
        </form>
      </div>
    </div>
  );
}
