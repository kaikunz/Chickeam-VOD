"use client";
import { useEffect, useState } from 'react';
import Link from "next/link";

export const Fetchvideo = () => {

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        fetch('/api/video')
          .then((response) => response.json())
          .then((data) => setVideos(data))
          .catch((error) => console.error('Error fetching videos:', error));
      }, []);
    
      return (
        <div className="mx-auto px-4 xl:max-w-7xl pt-[50px]">
          <h1 className="mb-4">All Videos</h1>
          <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 gap-y-6 relative px-1 md:px-4 ml-1">
            {videos.map((video: any) => (
              <Link href={`/watch/${video.slug}`}>
                <img src={video.thumbnail} className="bg-cover bg-center w-full aspect-video rounded-xl" />
                <h2>{video.title || 'Untitled'}</h2>
              </Link>
            ))}
          </div>
        </div>
      );
    

}