"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session, status } = useSession();
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span>💹</span>
          <span className="bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            ФинОлимп
          </span>
        </Link>
        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/#how-it-works" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Как играть</Link>
          <Link href="/leaderboard" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">Рейтинг</Link>
        </nav>
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-slate-700" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <button onClick={() => signOut()} className="text-xs text-slate-400 hover:text-slate-200 transition-colors">Выйти</button>
              {session.user.image ? (
                <Image src={session.user.image} alt={session.user.name ?? "Аватар"} width={32} height={32} className="rounded-full ring-2 ring-indigo-500" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                  {(session.user.name ?? "U")[0].toUpperCase()}
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => signIn()} className="rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 px-4 py-1.5 text-sm font-semibold text-white shadow hover:opacity-90 transition-opacity">
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
