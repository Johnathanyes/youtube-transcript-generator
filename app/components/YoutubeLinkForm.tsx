"use client"
import React, { useState, FormEvent } from 'react'
import Form from 'next/form'
import { getTranscript } from '../lib/getTranscript';

export default function YouTubeLinkForm() {
  const [link, setLink] = useState<string | null>("");
  const [error, setError] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isValidYouTubeUrl = (url: string) => {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return regex.test(url);
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("") // Clear previous errors when a new request starts
    try {
      const formData = new FormData(event.currentTarget);
      const form_link = formData.get("link") as string;
      if (!isValidYouTubeUrl(form_link)) {
        setError("Enter a correct youtube link")
      }
      setLink(form_link);

      const response = getTranscript(link!);

      

    } catch (error) {
      // Capture the error message to display to the user
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Form onSubmit={onSubmit} action="/">
        <input type="text" name="link" placeholder="Enter Youtube Link"/>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </Form>
    </div>
  );
}