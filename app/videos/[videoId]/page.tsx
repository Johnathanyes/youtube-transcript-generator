"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { redirect, useParams } from "next/navigation";

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
  }, [status, redirect]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form behavior

        if (!userQuestion.trim()) {
            alert("Please enter a question.");
            return;
        }

        setIsLoading(true); // Start loading state
        try {
            // Send the user's question to the backend
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
                throw new Error("Failed to send message");
            }
            const data = await response.json();
            console.log("Backend Response:", data);

            // Clear the input field after successful submission
            setUserQuestion("");
        } catch (error) {
            console.error("Error submitting question:", error);
            alert("An error occurred while sending your question.");
        } finally {
            setIsLoading(false); // End loading state
        }
    }

  return (
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
  );
}
