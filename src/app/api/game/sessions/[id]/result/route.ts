import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ARCHETYPES } from "@/types/game";
import type { ArchetypeId } from "@/types/game";

// GET /api/game/sessions/[id]/result — итоги симуляции
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: sessionId } = await params;

  const gameSession = await prisma.gameSession.findUnique({
    where: { id: sessionId },
    include: {
      turns: { orderBy: { turnNumber: "asc" } },
      template: true,
      user: { select: { nickname: true, name: true, ageGroup: true, grade: true } },
    },
  });

  if (!gameSession || gameSession.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (gameSession.status !== "COMPLETED") {
    return NextResponse.json({ error: "Session not completed" }, { status: 400 });
  }

  const archetypeId = gameSession.businessArchetype as ArchetypeId | null;
  const archetype = archetypeId ? ARCHETYPES[archetypeId] : null;

  return NextResponse.json({
    session: {
      id: gameSession.id,
      templateName: gameSession.template.name,
      totalProfit: gameSession.totalProfit,
      totalRevenue: gameSession.totalRevenue,
      totalExpenses: gameSession.totalExpenses,
      customerSatisfaction: gameSession.customerSatisfaction,
      completedAt: gameSession.completedAt,
    },
    turns: gameSession.turns.map((t) => ({
      turnNumber: t.turnNumber,
      revenue: t.revenue,
      expenses: t.expenses,
      profit: t.profit,
      customers: t.customers,
      satisfaction: t.satisfaction,
      explanation: t.explanation,
      eventImpact: t.eventImpact,
    })),
    archetype,
    behaviorProfile: gameSession.behaviorProfile,
    universityRecommendations: gameSession.universityRecommendations,
    user: gameSession.user,
  });
}
