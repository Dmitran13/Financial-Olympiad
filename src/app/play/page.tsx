"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TemplateCard from "@/components/game/TemplateCard";

const TEMPLATES = [
  { slug: "shop", emoji: "🛒", name: "Магазин", description: "Небольшой продуктовый магазин в спальном районе", startCash: 50000 },
  { slug: "cafe", emoji: "☕", name: "Кафе", description: "Уютное кафе рядом со школой", startCash: 60000 },
];

export default function PlayPage() {
  const router = useRouter();
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  const handleSelect = async (slug: string) => {
    setLoadingSlug(slug);
    try {
      const res = await fetch("/api/game/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateSlug: slug }),
      });
      const data = await res.json();
      router.push(`/play/${data.sessionId}`);
    } catch {
      alert("Не удалось начать игру. Проверь подключение.");
      setLoadingSlug(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-white mb-2">Выбери свой бизнес</h1>
        <p className="text-slate-400">С чего начнём?</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {TEMPLATES.map((t) => (
          <TemplateCard
            key={t.slug}
            emoji={t.emoji}
            name={t.name}
            description={t.description}
            startCash={t.startCash}
            onClick={() => handleSelect(t.slug)}
            isLoading={loadingSlug === t.slug}
          />
        ))}
      </div>
    </div>
  );
}
