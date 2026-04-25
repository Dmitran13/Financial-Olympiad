export default function EventBanner({ description }: { description: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-amber-500/50 bg-amber-900/40 p-4">
      <span className="text-xl">🌪️</span>
      <div>
        <div className="text-sm font-semibold text-amber-300">Случайное событие</div>
        <div className="mt-0.5 text-sm text-amber-200/80">{description}</div>
      </div>
    </div>
  );
}
