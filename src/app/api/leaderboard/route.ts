import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AgeGroup } from "@prisma/client";

// GET /api/leaderboard?ageGroup=JUNIOR&templateSlug=shop&limit=50
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const ageGroup = searchParams.get("ageGroup") as AgeGroup | null;
  const templateSlug = searchParams.get("templateSlug");
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50", 10));

  const sessions = await prisma.gameSession.findMany({
    where: {
      status: "COMPLETED",
      ...(ageGroup ? { ageGroup } : {}),
      ...(templateSlug ? { template: { slug: templateSlug } } : {}),
    },
    orderBy: { totalProfit: "desc" },
    take: limit,
    include: {
      user: { select: { nickname: true, name: true, avatar: true, city: true } },
      template: { select: { name: true, emoji: true } },
    },
  });

  const rows = sessions.map((s, index) => ({
    rank: index + 1,
    userId: s.userId,
    nickname: s.user.nickname ?? s.user.name ?? "Аноним",
    avatar: s.user.avatar,
    city: s.user.city,
    templateName: s.template.name,
    templateEmoji: s.template.emoji,
    totalProfit: s.totalProfit,
    customerSatisfaction: s.customerSatisfaction,
    archetype: s.businessArchetype,
    completedAt: s.completedAt,
  }));

  return NextResponse.json({ rows });
}
