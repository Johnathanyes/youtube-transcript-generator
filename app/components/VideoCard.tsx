import React from 'react'
import {Card, CardHeader, CardBody, CardFooter} from "@heroui/card";
import Image from 'next/image';
import {Button, ButtonGroup} from "@heroui/button";
import Link from 'next/link';

const VideoCard = ({videoData}: any) => {
  return (
    <Card className="py-4 bg-black">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h2 className="text-tiny uppercase font-bold">{videoData.videoTitle}</h2>
        <small className="text-default-500">Channel: {videoData.videoChannel}</small>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={videoData.videoThumbnail}
          width={270}
          height={270}
        />
      </CardBody>
      <Button color="default" variant="shadow">
        <Link href={`/videos/${videoData.videoId}`}>
          Open Video
        </Link>
      </Button>
    </Card>
  )
}

export default VideoCard
