import React from "react";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { IoStatsChartSharp, IoBookmarksOutline } from "react-icons/io5";
import { FiShare } from "react-icons/fi";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { useMainDashContext } from "../../Context/AppContext";

import ImageKit from "imagekit";
import { BsEmojiSmile } from "react-icons/bs";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { CgOptions } from "react-icons/cg";
import { MdOutlineGifBox } from "react-icons/md";
import { PiImageSquare } from "react-icons/pi";

const PostPage = () => {
  const { handle, postId } = useParams();
  const { authUser } = useMainDashContext();
  //   console.log("authUser:", authUser);
  const [post, setPost] = useState({});
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

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
      };

      console.log("Post Data:", postData);

      await axios.post(
        `http://localhost:3000/post/comment/${postId}/${handle}`,
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

  useEffect(() => {
    console.log(handle, postId);
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/post/${postId}/${handle}`
        );
        console.log(response.data.post);
        setPost(response.data.post);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, []);

  const renderImages = () => {
    const { mediaUrl } = post;

    if (!mediaUrl || mediaUrl.length === 0) return null;

    if (mediaUrl.length === 1) {
      return (
        <div className="w-full">
          <img
            src={mediaUrl[0]}
            className="rounded-3xl w-full mt-4"
            alt="media"
          />
        </div>
      );
    } else if (mediaUrl.length === 2) {
      return (
        <div className="flex gap-2 w-full mt-4">
          {mediaUrl.map((url, index) => (
            <img
              key={index}
              src={url}
              className="rounded-3xl w-1/2 object-cover"
              alt="media"
            />
          ))}
        </div>
      );
    } else if (mediaUrl.length === 3) {
      return (
        <div className="flex gap-2 w-full mt-4">
          <div className="w-1/2">
            <img
              src={mediaUrl[0]}
              className="rounded-3xl h-full object-cover"
              alt="media"
            />
          </div>
          <div className="w-1/2 flex flex-col gap-2">
            <img
              src={mediaUrl[1]}
              className="rounded-3xl w-full object-cover"
              alt="media"
            />
            <img
              src={mediaUrl[2]}
              className="rounded-3xl w-full object-cover"
              alt="media"
            />
          </div>
        </div>
      );
    } else if (mediaUrl.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-2 w-full mt-4">
          {mediaUrl.map((url, index) => (
            <img
              key={index}
              src={url}
              className="rounded-3xl w-full object-cover"
              alt="media"
            />
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <div className="flex flex-col border-b w-full border-[#2f3336] items-start  gap-3 px-6">
        <div className=" px-4 py-4 w-full justify-start  sticky top-0  bg-black/70 backdrop-blur-md items-center gap-8 flex">
          <Link to="/home">
            <FaArrowLeft className="text-xl" />
          </Link>
          <div className=" flex flex-col gap-1">
            <h1 className=" text-xl font-bold">Post</h1>
          </div>
        </div>
        <div className="flex items-start  flex-col justify-center ">
          <div className="flex items-start gap-3">
            <img
              src={post && post.author && post.authorDetails.profilePicture}
              className="h-10 w-10 mt-2 rounded-full"
              alt="profile"
            />
            <div className="items-start flex-col flex ">
              <Link to={`/profile/${handle}`}>
                <h1 className="text-lg font-semibold">{handle}</h1>
              </Link>
              <Link to={`/profile/${handle}`}>
                <p className="text-gray-500">@{handle}</p>
              </Link>
            </div>
          </div>
          <div className=" ">
            <div className="  ml-1 ">
              <p className=" text-lg     mt-2">{post && post.content}</p>
              {renderImages()}
            </div>
          </div>
        </div>
        <h1 className="  text-[17px] tracking-wider  text-gray-500  font-medium">
          {" "}
          5:40 PM . Jun 9, 2024 . 1.1M Views
        </h1>

        <div className=" w-full px-4  h-[1px] bg-gray-600 " />
        <div className="text-gray-500 flex  justify-around  text-xl -ml-4   w-full">
          <button className="flex gap-2 items-center">
            <FaRegComment />
            <p className="   text-[16px]">656</p>
          </button>
          <button className="flex gap-2 items-center">
            <FaRetweet />
            <p className="   text-[16px]">10</p>
          </button>
          <button className="flex gap-2 items-center">
            <FiHeart />
            <p className="   text-[16px]"> 566</p>
          </button>
          <button className="flex gap-2 items-center">
            <IoStatsChartSharp />
            <p className="   text-[16px]">10</p>
          </button>
          <div className="flex gap-4 justify-between">
            <button className="flex gap-2 items-center">
              <FiShare className=" text-xl" />
            </button>
          </div>
        </div>
        <div className=" w-full  h-[1px] bg-gray-600 " />

        <div className="rounded-2xl items-start justify-start max-h-[30rem] flex   px-2 py-5 w-full gap-4 overflow-y-auto">
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
                    <BsEmojiSmile className="text-[20px] font-bold text-[#1d9bf0]" />
                  </button>
                </div>

                <button
                  className="bg-[#1d9bf0] opacity-60 h-10 w-20 rounded-full text-lg items-center flex justify-center text-white font-semibold"
                  onClick={handlePost}
                  disabled={loading || !content}
                >
                  {loading ? "Posting..." : "Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
