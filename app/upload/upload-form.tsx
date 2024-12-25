"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from 'axios';
import { useRouter } from 'next/navigation'


const VideoUploadForm = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState<number>(0);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);

    try {
      const res = await axios.post("https://chickeam.com/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted); 
          }
        },
      });

      if (res.status === 200) {
        const { slug, path, path2 } = res.data;

        

        const videoData = {
          title,
          description,
          thumbnail: "https://chickeam.com/nothumb.jpg",
          type: 2,
          price_rent: null,
          price_sell: null,
          slug: slug,
          path: path2,
        };

        const res2 = await axios.post("/api/addvideo", videoData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res2.status === 201) {
          router.push(`/watch/${slug}`);
        }
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      toast.error("Error uploading video");
    }
  };

  return (
    <>
        <p className="text-2xl font-bold mb-4">อัปโหลดวิดีโอ</p>
        <form className="lg:w-1/2 w-full mx-auto" onSubmit={handleSubmit}>
        <p className="text-gray-600 mb-3">ชื่อวิดีโอ</p>
        <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required className="block w-full px-4 py-5 text-sm mb-4 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
        />
        <p className="text-gray-600 mb-3">คำอธิบายวิดีโอ</p>
        <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required className="block w-full px-4 py-5 text-sm mb-4 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
        />
        {/* <input
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            required
        /> */}
        <label className="block">
          <span className="sr-only">Choose profile photo</span>
          <input
            type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className="block w-full text-sm text-red-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-red-50 file:text-red-700
          hover:file:bg-red-100
        " required/>
        </label>

        <button type="submit" className="inline-block px-7 py-4 mt-5 bg-red-500 text-white text-lg font-bold leading-snug uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out w-full">อัปโหลดวิดีโอ</button>
        </form>

        {progress > 0 && (
        <div className="mt-12 lg:w-1/2 w-full mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-red-500 h-4 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          {progress === 100 ? (
            <p className="text-center mt-2 font-bold">Converting...</p>
          ) : (
            <p className="text-center mt-2 font-bold">{progress}%</p>
          )}
        </div>
      )}

    </>
  );
};

export default VideoUploadForm;