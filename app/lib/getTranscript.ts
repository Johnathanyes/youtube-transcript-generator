"use server"

import { YoutubeTranscript } from 'youtube-transcript';


export const getTranscript = async (video_link: string): Promise<string> => {
    try {
        const transcriptData = await YoutubeTranscript.fetchTranscript(video_link);
        const uncleaned_transcript = transcriptData.map((object) => object.text).join(" ");

        const cleaned_transcript = replaceHtmlEntities(uncleaned_transcript);
        
        return cleaned_transcript;
    } catch (error) {
        throw error;
    }
}

function replaceHtmlEntities(text: string): string {
    return text.replace(/&amp;#39;/g, "'");
}