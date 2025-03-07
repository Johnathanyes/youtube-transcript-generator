import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET(req: Request) {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const chatEntry = await prisma.user.findMany({
        where: {
            
        }
    })
  
    return NextResponse.json(chatEntry ? chatEntry.messages : []);
  }