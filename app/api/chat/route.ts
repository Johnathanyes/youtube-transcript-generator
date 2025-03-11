import { NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { OpenAI } from "openai";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { videoId, userMessage, userId } = await req.json();

    if (!videoId || !userMessage || !userId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    // Authenticate user
    const session = await auth();
    if (!session || session.user?.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve transcript chunks
    const video = await prisma.videoSummary.findUnique({
      where: { videoId },
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }
    
    // Send user question + transcript chunks to ChatGPT
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `You are an AI answering based on a video's transcript.` },
        { role: "user", content: `Transcript Chunks:\n${video.transcriptChunks.join("\n")}\nUser: ${userMessage}` },
      ],
    });
    console.log("get chatgpt response");
    

    const chatGptResponse = chatResponse.choices[0]?.message.content?.trim();
    if (!chatGptResponse) {
      return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
    console.log("there is chatgpt response");
    
    // Store user message
    await prisma.chatMessage.create({
      data: {
        userId,
        videoId,
        message: { sender: "user", text: userMessage },
      },
    });
    console.log("created user chat");
    
    
    // Store ChatGPT response
    await prisma.chatMessage.create({
      data: {
        userId,
        videoId,
        message: { sender: "chatgpt", text: chatGptResponse },
      },
    });

    console.log("created chatgpt chat");
    
    return NextResponse.json({ chatGptResponse }, { status: 200 });

  } catch (error) {
    console.log("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
