"use client";
import { useState } from "react";

interface Props {
  nickname: string;
  archetype: { emoji: string; name: string };
  totalProfit: number;
  templateName: string;
  completedAt?: string;
}

export default function CertificatePreview({ nickname, archetype, totalProfit, templateName, completedAt }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const date = completedAt
    ? new Date(completedAt).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" })
    : new Date().toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="bg-slate-900 border-2 border-yellow-400/60 rounded-2xl p-8">
      <div className="text-yellow-400 font-bold text-xl text-center mb-1">🏅 Финансовая Олимпиада</div>
      <div className="border-t border-yellow-400/30 my-4" />
      <p className="text-center text-slate-400 text-sm leading-relaxed">
        Настоящим подтверждается, что{" "}
        <span className="text-white font-bold text-lg">{nickname}</span>{" "}
        успешно управлял бизнесом{" "}
        <span className="text-white font-medium">«{templateName}»</span>{" "}
        и заработал{" "}
        <span className="text-emerald-400 font-bold">{totalProfit.toLocaleString("ru")} ₽</span>,{" "}
        проявив себя как{" "}
        <span className="text-white font-bold">{archetype.emoji} {archetype.name}</span>.
      </p>
      <div className="text-right text-slate-500 text-xs mt-4">{date}</div>
      <div className="flex gap-3 mt-6">
        <button disabled title="Скоро доступно!" className="flex-1 py-2.5 rounded-xl border border-slate-700 text-sm font-semibold text-slate-500 cursor-not-allowed opacity-50">
          📥 Скачать PDF
        </button>
        <button onClick={handleShare} className="flex-1 py-2.5 rounded-xl border border-slate-600 text-sm font-semibold text-slate-300 hover:border-indigo-500 transition-colors">
          {copied ? "✅ Скопировано!" : "🔗 Поделиться"}
        </button>
      </div>
    </div>
  );
}
