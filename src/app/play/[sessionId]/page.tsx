import GameBoard from "@/components/game/GameBoard";

export default async function PlaySessionPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  return <GameBoard sessionId={sessionId} />;
}
