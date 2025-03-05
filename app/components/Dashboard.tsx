"use client"

import { prisma } from "@/prisma";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import VideoCard from "./VideoCard";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/getVideos")
        .then((res) => res.json())
        .then((data) => setVideos(data));
    }
  }, [status]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return <div>Log In</div>;

  return (
    <div>
      {videos.map((video:any) => (<VideoCard key={video.id} videoData={video} />))}
    </div>
  );
};

export default Dashboard;
