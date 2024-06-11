import React, { useState } from "react";
import { PiImageSquare } from "react-icons/pi";
import { MdOutlineGifBox } from "react-icons/md";
import { CgOptions } from "react-icons/cg";
import { BsEmojiSmile } from "react-icons/bs";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { useMainDashContext } from "../Context/AppContext";
import ImageKit from "imagekit";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { useRef } from "react";
import { useEffect } from "react";
import { URL } from "../../Link";

const ComposePost = ({ composeModal, post }) => {
  const { authUser } = useMainDashContext();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("composeModal:", post);

  const imagekit = new ImageKit({
    publicKey: "public_u7kxH7LgunPNp3hdLZv7edHsbBI=",
    privateKey: "private_8CshqjFmGQTjPw/kXsyOixM5ctM=",
    urlEndpoint: "https://ik.imagekit.io/7da6fpjdo/coverImg",
    authenticationEndpoint: "http://localhost:3000/imagekit-auth",
  });

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      // Upload file to ImageKit
      const uploadResponse = await imagekit.upload({
        file,
        fileName: file.name,
      });

      console.log("Upload Response:", uploadResponse);

      const imageUrl = uploadResponse.url;

      // Update images array
      setImages((prevImages) => [...prevImages, { url: imageUrl }]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    setLoading(true);
    try {
      const postData = {
        content,
        images,
        userId: authUser.userId,
        parentCommentId: post?._id,
      };

      console.log("Post Data:", postData);

      await axios.post(
        `${URL}/post/comment/${post?._id}/${post.author.handle}`,
        postData
      );

      setContent("");
      setImages([]);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };
  const [calHeight, setCalHeight] = useState(0);
  const calHeightRef = useRef(null);
  useEffect(() => {
    if (calHeightRef.current) {
      setCalHeight(calHeightRef.current.clientHeight);
    }
  }, [post]);
  return (
    <>
      <div
        className={`rounded-2xl   flex-col w-full flex px-10 py-5  custom-scrollbar max-h-[30rem] overflow-y-auto gap-4  `}
      >
        <div className="flex gap-3   items-start flex-col  " ref={calHeightRef}>
          <div
            className={`bg-gray-600 mt-2 top-20 left-14   absolute w-[2px]`}
            style={{ height: `${(calHeight && calHeight) - 30}px` }}
          />
          <div className=" flex gap-4 items-start justify-center">
            <img src={post?.author.profilePicture} className=" h-10 w-10" />
            <div className="flex  gap-1 flex-col">
              <div className=" flex  items-center  gap-1">
                <h1 className="text-white text-xl font-semibold">
                  {post?.author.username}
                </h1>
                <h1 className=" mt-1 text-md text-gray-500 font-semibold">
                  @{post?.author.handle}
                </h1>
              </div>
              <h1 className=" text-lg font-semibold">{post?.content}</h1>
              <h1 className=" text-md text-gray-500   font-semibold">
                Replying to{" "}
                <span className="  text-[#1d9bf0]">@{post?.author.handle}</span>
              </h1>
            </div>
          </div>
        </div>
        <div className=" mt-2 w-full flex gap-3">
          <img
            src={authUser?.picture}
            className="h-10 w-10 rounded-full"
            alt="profile"
          />
          <div className="w-full">
            <textarea
              type="text"
              placeholder="What's happening?"
              className="w-full h-14 text-2xl border-none active:outline-none outline-none focus:border-none bg-transparent text-white"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <h1 className="text-[#1d9bf0] font-semibold">Everyone can reply</h1>
            {images.length > 0 && (
              <div className="mt-4 flex overflow-x-auto gap-2">
                {images.map((image, index) => (
                  <div key={index} className="flex relative">
                    <IoClose
                      className="text-white text-2xl absolute right-0 top-0 cursor-pointer"
                      onClick={() =>
                        setImages((prevImages) =>
                          prevImages.filter((_, i) => i !== index)
                        )
                      }
                    />
                    <img
                      src={image.url}
                      className="h-56 w-56 object-cover rounded-md"
                      alt="uploaded"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="bg-[#2f3336] h-[1px] mt-4 -ml-4 w-full" />
            <div className="w-full mt-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <PiImageSquare className="text-[22px] font-bold text-[#1d9bf0]" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  <button className="flex items-center">
                    <MdOutlineGifBox className="text-[22px] font-bold text-[#1d9bf0]" />
                  </button>
                  <button className="flex items-center">
                    <CgOptions className="text-[22px] font-bold text-[#1d9bf0]" />
                  </button>
                  <button className="flex items-center">
                    <BsEmojiSmile className="text-[20px] font-bold text-[#1d9bf0]" />
                  </button>
                  <button className="flex items-center">
                    <RiCalendarScheduleLine className="text-[20px] font-bold text-[#1d9bf0]" />
                  </button>
                </div>

                <button
                  className="bg-[#1d9bf0] opacity-60 h-10 w-20 rounded-full text-lg items-center flex justify-center text-white font-semibold"
                  onClick={handlePost}
                  disabled={loading || !content}
                >
                  {loading ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComposePost;
