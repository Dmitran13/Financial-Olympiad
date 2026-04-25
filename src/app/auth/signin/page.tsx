"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/onboarding" });
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-8 ring-1 ring-slate-800 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">💹</div>
          <h1 className="text-2xl font-extrabold text-white">Войти в ФинОлимп</h1>
          <p className="mt-2 text-sm text-slate-400">Выбери способ входа, чтобы продолжить</p>
        </div>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path d="M47.532 24.552c0-1.636-.148-3.2-.42-4.704H24v8.908h13.196c-.572 3.064-2.308 5.66-4.916 7.4v6.152h7.952c4.656-4.288 7.3-10.608 7.3-17.756z" fill="#4285F4"/>
              <path d="M24 48c6.6 0 12.136-2.188 16.18-5.924l-7.952-6.152c-2.204 1.48-5.024 2.352-8.228 2.352-6.332 0-11.692-4.276-13.608-10.02H2.18v6.352C6.204 42.636 14.504 48 24 48z" fill="#34A853"/>
              <path d="M10.392 28.256A14.896 14.896 0 0 1 9.6 24c0-1.48.256-2.912.792-4.256v-6.352H2.18A23.948 23.948 0 0 0 0 24c0 3.872.928 7.536 2.18 10.608l8.212-6.352z" fill="#FBBC05"/>
              <path d="M24 9.552c3.568 0 6.764 1.228 9.28 3.64l6.952-6.952C36.12 2.188 30.584 0 24 0 14.504 0 6.204 5.364 2.18 13.392l8.212 6.352C12.308 13.828 17.668 9.552 24 9.552z" fill="#EA4335"/>
            </svg>
            {loading ? "Вход..." : "Войти через Google"}
          </button>
          <button disabled className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed">
            ВКонтакте
            <span className="text-xs text-slate-600">(скоро)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
