"use client";

import { useState, useEffect } from "react";

interface ChatMessage {
  id: string;
  userId: string;
  videoId: string;
  messages: { sender: "user" | "chatgpt"; text: string }[]; // Parsed messages
  createdAt: string;
}

const ChatHistory = ({ videoId, userId }: { videoId: string; userId: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await fetch(`/api/getChats?videoId=${videoId}&userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch chat history");
        const data = await res.json();
        console.log("API Response:", data); // Inspect the response

        // Access the nested `chatMessages` property
        const messagesArray = Array.isArray(data.chatMessages) ? data.chatMessages : [];
        setMessages(messagesArray);
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [videoId, userId]);

  useEffect(() => {
    console.log("Updated Messages:", messages); // Log updated messages
  }, [messages]);

  if (loading) return <p>Loading chat...</p>;

  return (
    <div className="p-4 space-y-4 bg-black rounded-lg max-w-lg mx-auto border-2 border-red-500">
      {messages.length > 0 ? (
        messages.map((message: ChatMessage) => (
          <div key={message.id}>
            {message.message.sender === "user" ? 
              <div className="flex justify-between">
                <h3>ChatGPT: </h3>
                <p>{message.message.text}</p>
              </div>
              :
              <div className="flex justify-between">
                <h3>User: </h3>
                <p>{message.message.text}</p>
              </div>
          }
          </div>
        ))
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
};

export default ChatHistory;