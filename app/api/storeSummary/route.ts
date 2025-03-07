import type { NextApiResponse } from 'next'
import { prisma } from '@/prisma'
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request, res: NextResponse) {
    if (req.method !== "POST") {
        return NextResponse.json({ error: "Method Not Allowed" }, { status: 403});
    }

    try {
        const session = await auth();
        if (!session || !session.user?.email) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { videoId, videoTitle, videoUrl, videoChannel, videoThumbnail, summary, transcriptChunks } = body;
        
        if (!videoId || !videoTitle || !videoUrl) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Retrieve the authenticated user's ID
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
    
        if (!user) {
          return NextResponse.json({ error: "User not found" }, { status: 404} );
        }
    
        // Store the video summary in the database
        const videoSummary = await prisma.videoSummary.create({
          data: {
            userId: user.id,
            videoId,
            videoTitle,
            videoUrl,
            videoChannel,
            videoThumbnail,
            summary,
            transcriptChunks,
          },
        });
        return NextResponse.json({ message: "Video summary saved successfully", videoSummary }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500});
      }
}