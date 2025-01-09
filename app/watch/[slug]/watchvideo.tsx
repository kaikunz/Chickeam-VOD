"use client";

import { ClockIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";


interface WatchVideosProps {
  video: {
    id: string;
    title: string;
    description: string;
    price_rent: number;
    price_sell: number;
    path: string;
    type: number;
    user: {
      nickname: string;
      follower: number;
      image: string;
    };
    hasPurchased: boolean;
    slugs: string;
  };
}


export default function WatchVideos({ video }: WatchVideosProps, { params }: { params: { slug: string } }) {

    const [datav, setData] = useState<any>(null);

    const router = useRouter();

  
    useEffect(() => {
        if (video && video.type === 2) {
          videotypeistwo();
        } else {
          const data = {
            type: 1,
            hasPurchased: false
          }
          setData(data)
        }
      }, [video]);
    
      const videotypeistwo = async () => {
        try {
          console.log("Function videotypeistwo is running");
          console.log("Video slug:", video.slugs);
    
          const res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getvideo`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slug: video.slugs,
            }),
          });
    
          if (!res2.ok) {
            throw new Error("Failed to fetch the video data");
          }
    
          const result = await res2.json();
          console.log("API response:", result);
          setData(result);
        } catch (error: any) {
          console.error("Error in videotypeistwo:", error.message);
        }
      };
    
      console.log("Props in WatchVideos:", video);

    const handleConfirmAndCallApi = async (action: "rent" | "buy") => {
        const actionText = action === "rent" ? "เช่า" : "ซื้อ";
        const successMessage =
          action === "rent"
            ? "เช่าสำเร็จระบบจะพาคุณไปยังหน้าประวัติ!"
            : "ซื้อสำเร็จระบบจะพาคุณไปยังหน้าประวัติ!";
    
        const result = await Swal.fire({
          title: "คุณแน่ใจแล้วใช่ไหม?",
          text: `ว่าจะ${actionText}วิดีโอนี้?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#850fd7",
          cancelButtonColor: "#d33",
          confirmButtonText: "ยืนยัน!",
          cancelButtonText: "ยกเลิก",
        });
    
        if (result.isConfirmed) {
          try {
            const response = await fetch(`/api/${action}`, {
              next: { revalidate: 0 },
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                videoId: video.id,
              }),
            });
    
            if (!response.ok) {
              throw new Error("Failed to perform the action.");
            }
    
            const data = await response.json();
            console.log("API Response:", data);
    
            const swalsuccess = await Swal.fire({
                title: "Success!",
                text: successMessage,
                icon: "success",
                confirmButtonText: "OK",
              });
              if (swalsuccess.isConfirmed) {
                router.refresh();
              }
          
            
          } catch (error: any) {
            Swal.fire("Error", error.message, "error");
          }
        }
      };
    
    //   const [videos, setVideos] = useState(null);
    //   const { slug } = params;

    //   useEffect(() => {
    //     const fetchExtraData = async () => {
    //       try {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getvideo`, {
    //           method: "POST",
    //           headers: {
    //             "Content-Type": "application/json",
    //           },
    //           body: JSON.stringify({ slug }),
    //         });
    
    //         if (!res.ok) {
    //           throw new Error("Failed to fetch extra data");
    //         }
    
    //         const data = await res.json();
    //         setVideos(data);
    //       } catch (error) {
    //         console.error("Error fetching extra data:", error);
    //       }
    //     };
    
    //     fetchExtraData();
    //   }, [slug]);
    
    const videoPath = video?.path || "default-path";
    const datavPath = datav?.path || "default-path";
    
  
  const url = `https://chickeam.com/play?test=https://chickeam.com/temp/${videoPath}/playlist.m3u8`;
  const url2 = `https://chickeam.com/play?test=https://chickeam.com/temp/${datavPath}/playlist.m3u8`;
  
  if (!datav) {
    return <div>กำลังโหลด</div>; 
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">

        {datav.type === 1 || datav.hasPurchased == true ? (
        
          <div className="rounded-lg shadow">
            <iframe className="w-full aspect-video rounded-lg" src={ datav.type == 2 ? url2 : url}></iframe>
          </div>
        ) : (
          <div className="relative bg-black rounded-lg shadow w-full h-[484px]">
            <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <p className="text-lg font-bold text-white text-center">
                เนื้อหาดังต่อไปนี้เป็นเนื้อหาพิเศษในการเข้าถึง
              </p>
              <div className="flex justify-center py-2">
                <button
                  className="text-lg font-bold text-white bg-red-600 rounded-lg px-6 py-2 hover:bg-red-700"
                  onClick={() => handleConfirmAndCallApi('rent')}
                >
                  <ClockIcon className="w-6 inline-flex mr-1" /> เช่า 30 วัน ฿{video.price_rent}
                </button>
                <button
                  className="text-lg font-bold text-white bg-red-600 rounded-lg ml-4 px-6 py-2 hover:bg-red-700"
                  onClick={() => handleConfirmAndCallApi('buy')}
                >
                  <ShoppingBagIcon className="w-6 inline-flex mr-1" /> ซื้อ ฿{video.price_sell}
                </button>
              </div>
            </div>
          </div>
        )}
          <p className="text-3xl mt-6 font-bold">{video.title}</p>
          <div className="flex items-center mb-6">
            <div className="shrink-0 mr-[16px] my-4">
                <img className="mx-auto md:size-12 size-16 shrink-0 rounded-full" src={video.user?.image ? video.user.image : "/images/default.png"} alt={video.user.nickname} />
            </div>

            <div className="flex flex-col grow min-w-0 mt-2 relative mt-3">
                <p className="font-bold md:text-md">{video.user.nickname}</p>
                <p className="text-gray-600 mt-1 font-semibold">
                    ผู้ติดตาม {video.user.follower} คน
                </p>
                <div className="absolute right-0 top-0">
                    <button id="addfollower" className="bg-red-600 text-white hover:bg-red-500 rounded-lg md:p-2 p-1 font-bold w-24 mt-2">ติดตาม</button>
                </div>
            </div>
        </div>

          <div className="mt-6 bg-gray-100 rounded-lg p-2">{video.description}</div>
        </div>
      </div>

    </>
  );
}

