import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const templates = await prisma.businessTemplate.findMany({
    where: { isActive: true },
    select: { slug: true, emoji: true, name: true, description: true, config: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(templates);
}
