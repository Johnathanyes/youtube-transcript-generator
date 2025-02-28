import type { NextApiResponse } from 'next'
import { prisma } from '@/prisma'
import { auth } from '@/auth';

export async function POST(req: Request, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {

        const session = await auth();
        if (!session || !session.user?.email) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const body = await req.json();
        const { videoId, videoTitle, videoUrl, videoChannel, videoThumbnail, summary, transcriptChunks } = body;
        
        if (!videoId || !videoTitle || !videoUrl) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        // Retrieve the authenticated user's ID
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
    
        if (!user) {
          return res.status(404).json({ error: "User not found" });
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
        return res.status(200).json({ message: "Video summary saved successfully", videoSummary });
      } catch (error) {
        console.log("Error storing video summary:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
}