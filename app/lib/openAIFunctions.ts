"use server"

import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateSummary = async (chunkedTranscript: string[]): Promise<string> => {

    const summarizedChunks:string[] = [];
    for (const transcript of chunkedTranscript) {
        const summary = await summarizeChunk(transcript);
        summarizedChunks.push(summary);
    }

    const concatenatedSummary: string = summarizedChunks.join(" ");

    const finalResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "Summarize this text into a final overall summary that retains key points." },
            { role: "user", content: concatenatedSummary }],
        max_tokens: 3000,
    })

    const finalSummary = finalResponse.choices[0].message.content;

    if (finalSummary) {
        return finalSummary;
    } else {
        throw new Error("Could not summarize video");
    }
}

const summarizeChunk = async (transcriptChunk:string): Promise<string> => {
    
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "Summarize the following part of a YouTube transcript in an informative way in english and in great detail." },
            { role: "user", content: transcriptChunk }],
        max_tokens: 2000,
      });
    
      return response.choices[0]?.message.content || "";
}