import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userVideos = await prisma.videoSummary.findMany({
    where: { userId: session.user.id },
  });

  return NextResponse.json(userVideos);
}