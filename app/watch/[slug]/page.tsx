import WatchVideos from './watchvideo';
import { auth } from '@/auth';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getvideo`, {
    next: { revalidate: 0 },
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      slug: slug,
    }),
  });

  if (!res.ok) {
    return {
      title: 'Video Not Found',
      description: 'The video you are looking for does not exist.',
    };
  }

  const video = await res.json();
  return {
    title: video.title,
    description: video.description || '',
  };
}

export default async function VideoPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const session = await auth();
  const user = session?.user;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getvideo`, {
    
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ slug }),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    return <div>Video not found</div>;
  }

  const video = await res.json();
  video.slugs = slug;
  return <WatchVideos user={user} video={video} />;
}