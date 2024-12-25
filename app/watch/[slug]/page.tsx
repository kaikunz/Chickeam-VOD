import { Metadata } from 'next';

interface VideoPage {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: VideoPage): Promise<Metadata> {
  const { slug } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getvideo?slug=${slug}`);
  if (!res.ok) {
    return {
      title: 'Post Not Found',
      description: 'The post you are looking for does not exist.',
    };
  }

  const post = await res.json();
  return {
    title: post.title,
    description: post.description || '.',
  };
}

export default async function WatchVideos({ params }: VideoPage) {
  const { slug } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getvideo?slug=${slug}`, {
    next: { revalidate: 10 }, 
  });

  if (!res.ok) {
    return <div>Video not found</div>;
  }

  const v = await res.json();

  const url = `https://chickeam.com/play?test=https://chickeam.com/temp/${v.path}/playlist.m3u8`;

  return (
    <>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="col-span-2">
                    <div className="rounded-lg shadow">
                        <iframe className="w-full aspect-video rounded-lg" src={url}></iframe>
                    </div>

                    <p className="text-3xl mt-4 font-bold">{v.title}</p>

                    <div className="mt-6 bg-gray-200 rounded-lg p-2">{v.description}</div>

                </div>


            </div>


    </>
  );
}