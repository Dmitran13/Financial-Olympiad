import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ db: "ok", env: !!process.env.DATABASE_URL });
  } catch (e) {
    return NextResponse.json({ db: "error", message: String(e) }, { status: 500 });
  }
}
