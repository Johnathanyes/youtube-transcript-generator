"use server"

import { YoutubeTranscript } from 'youtube-transcript';

const MAX_TOKENS = 7000;

const estimateTokenCount = (text: string): number => {
    const words = text.split(/\s+/); // Split by whitespace to count words
    return words.length; // Approximate token count based on word count
};


export const getTranscript = async (video_link: string): Promise<string> => {
    try {
        const transcriptData = await YoutubeTranscript.fetchTranscript(video_link);
        const uncleaned_transcript = transcriptData.map((object) => object.text).join(" ");

        const cleaned_transcript = replaceHtmlEntities(uncleaned_transcript);
        
        const token_length_estimate = estimateTokenCount(cleaned_transcript);
        return cleaned_transcript;
    } catch (error) {
        throw error;
    }
}

function replaceHtmlEntities(text: string): string {
    return text.replace(/&amp;#39;/g, "'");
}