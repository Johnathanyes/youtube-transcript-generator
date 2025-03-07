"use client"
import React from 'react'

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';

const ChatHistory = ({ videoId }: { videoId: string }) => {
    const { data: session, status} = useSession();
    if (!session) {
        redirect("/");
    }
  return (
    <div>
      
    </div>
  )
}

export default ChatHistory
