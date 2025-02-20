"use server"

import axios from "axios";

const RE_YOUTUBE = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

export const isValidYouTubeUrl = async (url: string): Promise<boolean> => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
};

export const retrieveVideoId = async (videoId:string):Promise<string> => {
    if (videoId.length === 11) {
        return videoId;
    }
    const matchId = videoId.match(RE_YOUTUBE);
    if (matchId && matchId.length) {
        return matchId[1];
    }
    throw new Error;
}

export const getVideoTitle = async (videoId: string):Promise<string | null> => {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos`,
            {
                params: {
                    part: "snippet",
                    id: videoId,
                    key: process.env.YOUTUBE_API_KEY,
                }
            }
        )
        const items = response.data.items;
        if (items.length > 0) {
            return items.snippet.title;
        }

        return null;
    } catch (error) {
        throw new Error("Could not get video title");
    }

}