import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    const userId = searchParams.get("userId");

    if (!videoId || !userId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Authenticate user
    const session = await auth();
    if (!session || session.user?.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve messages from database
    const chatMessages = await prisma.chatMessage.findMany({
      where: { videoId, userId },
      orderBy: { createdAt: "asc" },
    });
    console.log(chatMessages);
    
    return NextResponse.json({ chatMessages }, { status: 200 });

  } catch (error) {
    console.error("Chat History API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}