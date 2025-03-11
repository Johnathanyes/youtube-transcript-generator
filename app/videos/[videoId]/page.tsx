"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";
import { NextResponse } from "next/server";
import ChatHistory from "@/app/components/ChatHistory";

export default function VideoChatPage({
  params,
}: {
  params: { videoId: string };
}) {
  const { videoId } = useParams();
  const { data: session, status } = useSession();
  const [userQuestion, setUserQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
  }, [status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userQuestion.trim()) {
      alert("Please enter a question.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoId,
          userMessage: userQuestion,
          userId: session?.user?.id, // Assuming session.user.id exists
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserQuestion("");
    } catch (error) {
      console.error("Error submitting question:", error);
      alert("An error occurred while sending your question.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        {videoId && session?.user.id ? (
          <ChatHistory videoId={videoId} userId={session.user.id} />
        ) : (
          <div></div>
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            placeholder="Ask a question about the video..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
