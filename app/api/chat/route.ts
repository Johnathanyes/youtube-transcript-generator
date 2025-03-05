import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { videoId, message } = await req.json();
        if (!videoId || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if the user owns this video summary
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const videoSummary = await prisma.videoSummary.findUnique({
            where: { videoId, userId: user.id },
        });

        if (!videoSummary) {
            return NextResponse.json({ error: "Access Denied" }, { status: 403 });
        }

        return NextResponse.json({ message: "User authenticated and authorized" }, { status: 200 });

    } catch (error) {
        console.error("Authentication error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
