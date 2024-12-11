"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";


const VideoUploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file);

    const res = await fetch("https://chickeam.com/upload", {
      method: "POST",
      body: formData,
    });




    if (res.ok) {
        const responseData = await res.json();
        const { slug, path, path2 } = responseData;

        const showplayer = document.getElementById("showplayer");
        if (showplayer) {
            showplayer.innerHTML = `<iframe class="responsive-iframe" src="${path}" allow="fullscreen"></iframe>`;
        }

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

        const res2 = await fetch("/api/addvideo", {
          method: "POST",
          body: JSON.stringify(videoData),
        });

        if (res2.ok) {
          toast.success("Video Added")
        }
    }

  };

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required className="block w-full px-4 py-5 text-sm mb-4 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        />
        <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required className="block w-full px-4 py-5 text-sm mb-4 font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        />
        <input
            type="file"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            required
        />
        <button type="submit" className="bg-blue-600 p-4 rounded-md text-white mt-4">Upload</button>
        </form>
        <div id="showplayer"></div>
    </div>
  );
};

export default VideoUploadForm;