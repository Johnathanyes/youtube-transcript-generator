"use client";
import React, { useState, FormEvent } from "react";
import Form from "next/form";
import { getTranscript } from "../lib/getTranscript";
import { chunkTranscript } from "../lib/chunkTranscript";
import {
  isValidYouTubeUrl,
  retrieveVideoId,
  getVideoData,
} from "../lib/youtubeInformationFunctions";
import { generateSummary } from "../lib/openAIFunctions";
import { useSession } from "next-auth/react";

export default function YouTubeLinkForm() {
  const [link, setLink] = useState<string | null>("");
  const [error, setError] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const formData = new FormData(event.currentTarget);
      const form_link = formData.get("link") as string;
      if (!(await isValidYouTubeUrl(form_link))) {
        setError("Enter a correct youtube link");
        return;
      }
      setLink(form_link);

      const transcript = await getTranscript(form_link);
      const chunkedTranscript = await chunkTranscript(transcript);

      const youtubeId = await retrieveVideoId(form_link);
      const youtubeData = await getVideoData(youtubeId);
      const summary = await generateSummary(chunkedTranscript);

      if (!youtubeData) {
        setError("Failed to retrieve YouTube video data.");
        return;
      }
  
      const videoTitle = youtubeData.snippet.title;
      const videoChannel = youtubeData.snippet.channelTitle;
      const videoThumbnail = youtubeData.snippet.thumbnails.high.url;

      const response = await fetch("/api/storeSummary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId: youtubeId,
          videoTitle,
          videoUrl: form_link,
          videoChannel,
          videoThumbnail,
          summary,
          transcriptChunks: chunkedTranscript,
        }),
      });

    } catch (error) {
      // Capture the error message to display to the user
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <div>Log in</div>;
  }
  return (
    <div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Form onSubmit={onSubmit} action="/">
        <input type="text" name="link" placeholder="Enter Youtube Link" />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </Form>
    </div>
  );
}
