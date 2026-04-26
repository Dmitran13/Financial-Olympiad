"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TemplateCard from "@/components/game/TemplateCard";

interface Template {
  slug: string;
  emoji: string;
  name: string;
  description: string;
  config: { startCash: number };
}

export default function PlayPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/game/templates")
      .then((r) => r.json())
      .then((data) => setTemplates(data))
      .catch(() => {});
  }, []);

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
      {templates.length === 0 ? (
        <div className="text-slate-500 text-sm">Загружаем бизнесы...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
          {templates.map((t) => (
            <TemplateCard
              key={t.slug}
              emoji={t.emoji}
              name={t.name}
              description={t.description}
              startCash={t.config.startCash}
              onClick={() => handleSelect(t.slug)}
              isLoading={loadingSlug === t.slug}
            />
          ))}
        </div>
      )}
    </div>
  );
}
