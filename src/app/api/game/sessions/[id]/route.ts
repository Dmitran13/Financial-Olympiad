import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const gameSession = await prisma.gameSession.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      template: true,
      turns: { orderBy: { turnNumber: "asc" } },
    },
  });

  if (!gameSession) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const lastTurn = gameSession.turns.at(-1);
  return NextResponse.json({
    id: gameSession.id,
    status: gameSession.status,
    currentTurn: gameSession.currentTurn,
    cash: gameSession.cash,
    customerSatisfaction: lastTurn?.satisfaction ?? 60,
    template: {
      slug: gameSession.template.slug,
      name: gameSession.template.name,
      ageGroup: gameSession.ageGroup,
    },
    turns: gameSession.turns.map((t) => ({
      turnNumber: t.turnNumber,
      profit: t.profit,
      revenue: t.revenue,
      expenses: t.expenses,
      customerSatisfaction: t.satisfaction,
      eventId: t.eventId,
      explanation: t.explanation,
    })),
  });
}
