"use server"

export const chunkTranscript = async (transcript: string, chunkSize=4000): Promise<string[]> => {
    const splitTransctipt = transcript.split(" ");
    
    const transcriptChunks: string[] = [];

    for (let i = 0; i < splitTransctipt.length; i += chunkSize) {
        transcriptChunks.push(splitTransctipt.slice(i, i + chunkSize).join(" "));
    }
    return transcriptChunks;
}