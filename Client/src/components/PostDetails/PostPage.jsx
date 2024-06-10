import React, { useRef } from "react";
import { FaRegComment, FaRetweet, FaArrowLeft } from "react-icons/fa";
import { FiHeart, FiShare } from "react-icons/fi";
import {
  IoStatsChartSharp,
  IoBookmarksOutline,
  IoClose,
} from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMainDashContext } from "../../Context/AppContext";
import ImageKit from "imagekit";
import { BsEmojiSmile } from "react-icons/bs";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { CgOptions } from "react-icons/cg";
import { MdOutlineGifBox } from "react-icons/md";
import { PiImageSquare } from "react-icons/pi";
import Comments from "./Comments";
import { useLocation } from "react-router-dom";
// import { useMainDashContext } from "../../Context/AppContext";

const PostPage = ({}) => {
  const { handle, postId } = useParams();
  const { HiddenDatah, setHiddenDatah } = useMainDashContext();

  console.log("handle:", handle, "postId:", postId);
  const { authUser } = useMainDashContext();
  const { nestedComments, setNestedComments } = useMainDashContext();
  const [post, setPost] = useState({});
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNested, setIsNested] = useState(false);
  const LocalnestedComments = JSON.parse(
    localStorage.getItem("nestedComments")
  );
  console.log("LocalnestedComments:", LocalnestedComments);
  const [pageNestedComments, setPageNestedComments] = useState({});
  const [hiddenData, setHiddenData] = useState(() => {
    // Initialize state from localStorage if available
    const storedData = localStorage.getItem("hiddenData");
    return storedData ? JSON.parse(storedData) : {};
  });
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
      const uploadResponse = await imagekit.upload({
        file,
        fileName: file.name,
      });

      console.log("Upload Response:", uploadResponse);

      const imageUrl = uploadResponse.url;
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
        parentCommentId: postId,
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
        console.log(response.data);
        setIsNested(response.data.isNested);
        setPost(response.data.post);
        setHiddenData((prevHiddenData) => {
          const updatedHiddenData = {
            ...prevHiddenData,
            [postId]: response.data.post,
          };
          localStorage.setItem("hiddenData", JSON.stringify(updatedHiddenData));
          return updatedHiddenData;
        });
        setNestedComments((prevNestedComments) => {
          // Create a set to store unique IDs
          const uniqueIds = new Set(prevNestedComments);

          // Check if the response post ID already exists in the set
          if (!uniqueIds.has(response.data.post._id)) {
            // If it doesn't exist, add the new post ID to the array
            const updatedNestedComments = [
              ...prevNestedComments,
              response.data.post._id,
            ];

            // Store the updated nestedComments array in local storage
            localStorage.setItem(
              "nestedComments",
              JSON.stringify(updatedNestedComments)
            );

            return updatedNestedComments;
          } else {
            // If it already exists, return the previous state without adding the duplicate post ID
            return prevNestedComments;
          }
        });

        console.log("nestedComments:", nestedComments);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
  }, [handle, postId]);
  const getFirstHiddenData = () => {
    if (!hiddenData || typeof hiddenData !== "object") return null;

    const keys = Object.keys(hiddenData);
    if (keys.length > 0) {
      const firstKey = keys[0];
      return hiddenData[firstKey];
    }
    return null;
  };

  const firstHiddenData = getFirstHiddenData();
  console.log("First Hidden Data:", firstHiddenData);
  const renderImages = () => {
    let mediaUrl;
    if (isNested) {
      mediaUrl = post.parentPostId
        ? post.parentPostId.mediaUrl
        : (firstHiddenData && firstHiddenData.mediaUrl) || [];
    } else {
      mediaUrl = post ? post.mediaUrl : [];
    }

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

  const [calHeight, setCalHeight] = useState(0);
  const calHeightRef = useRef(null);
  useEffect(() => {
    if (calHeightRef.current) {
      setCalHeight(calHeightRef.current.clientHeight + 12);
    }
  }, [post]);

  useEffect(() => {
    const sendNestedCommentsToBackend = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/post/nestedComment",
          {
            params: {
              nestedComments: JSON.stringify(nestedComments), // Convert nestedComments array to JSON string
            },
          }
        );
        setPageNestedComments(response.data.nestedComments);
        console.log("Response from backend:", response.data.nestedComments);
      } catch (error) {
        console.error("Error sending nested comments to backend:", error);
      }
    };

    sendNestedCommentsToBackend();
  }, [nestedComments]);

  return (
    <>
      <div className="flex flex-col border-b w-full h-full border-[#2f3336] items-start gap-3 px-6">
        <div className="px-4 py-4 w-full justify-start sticky top-0 bg-black/70 backdrop-blur-md items-center gap-8 flex">
          <Link
            to="/home"
            //remove nested from the local storage
            onClick={() => {
              localStorage.removeItem("nestedComments");
              localStorage.removeItem("hiddenData");
            }}
          >
            <FaArrowLeft className="text-xl" />
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">Post</h1>
          </div>
        </div>
        {isNested && isNested ? (
          <div className="flex items-start flex-col h-full justify-center">
            <div className="flex items-start gap-3 h-full">
              <div className="flex flex-col relative h-full w-full items-center gap-2">
                <>
                  <img
                    src={
                      (post &&
                        post.parentPostId &&
                        post.parentPostId.author &&
                        post.parentPostId.author.profilePicture) ||
                      (firstHiddenData &&
                        firstHiddenData.author &&
                        firstHiddenData.author.profilePicture)
                    }
                    className="h-10 w-10 mt-2 rounded-full"
                    alt="profile"
                  />
                  <div
                    className={`bg-gray-600 mt-1 top-12 absolute w-[2px]`}
                    style={{ height: `${calHeight && calHeight}px` }}
                  />
                </>
              </div>

              <div className="items-start  flex-col  flex">
                <Link
                  to={{
                    pathname: `/profile/${
                      (post &&
                        post.parentPostId &&
                        post.parentPostId.author &&
                        post.parentPostId.author.handle) ||
                      (post && post.user && post.user.handle)
                    }`,
                  }}
                >
                  <h1 className="text-lg  w-72 font-semibold">
                    {(post &&
                      post.parentPostId &&
                      post.parentPostId.author &&
                      post.parentPostId.author.handle) ||
                      (post && post.user && post.user.handle)}
                  </h1>
                </Link>
                <Link
                  to={`/profile/${
                    (post &&
                      post.parentPostId &&
                      post.parentPostId.author &&
                      post.parentPostId.author.handle) ||
                    (post && post.user && post.user.handle)
                  }`}
                >
                  <p className="text-gray-500">
                    @
                    {(post &&
                      post.parentPostId &&
                      post.parentPostId.author &&
                      post.parentPostId.author.handle) ||
                      (post && post.user && post.user.handle)}
                  </p>
                </Link>
              </div>
            </div>
            <div className="cal-height pl-12" ref={calHeightRef}>
              <div className="ml-1">
                <p className="text-lg mt-2">
                  {post.parentPostId && post.parentPostId.content}
                </p>
                {renderImages()}
              </div>
            </div>
            {pageNestedComments &&
              pageNestedComments.map((comment) => (
                <Comments key={comment._id} post={comment} nested={1} />
              ))}
          </div>
        ) : (
          <>
            <div className="flex items-start flex-col justify-center">
              <div className="flex items-start gap-3">
                <img
                  src={post && post.author && post.author.profilePicture}
                  className="h-10 w-10 mt-2 rounded-full"
                  alt="profile"
                />
                <div className="items-start flex-col flex">
                  <Link to={`/profile/${post.author && post.author.handle}`}>
                    <h1 className="text-lg font-semibold">
                      {post.author && post.author.handle}
                    </h1>
                  </Link>
                  <Link to={`/profile/${post.author && post.author.handle}`}>
                    <p className="text-gray-500">
                      @{post.author && post.author.handle}
                    </p>
                  </Link>
                </div>
              </div>
              <div className="">
                <div className="ml-1">
                  <p className="text-lg mt-2">{post && post.content}</p>
                  {renderImages()}
                </div>
              </div>
            </div>
            <h1 className="text-[17px] tracking-wider text-gray-500 font-medium">
              5:40 PM . Jun 9, 2024 . 1.1M Views
            </h1>
          </>
        )}

        <div className="w-full px-4 h-[1px] bg-gray-600" />
        <div className="text-gray-500 flex justify-around text-xl -ml-4 w-full">
          <button className="flex gap-2 items-center">
            <FaRegComment />
            <p className="text-[16px]">656</p>
          </button>
          <button className="flex gap-2 items-center">
            <FaRetweet />
            <p className="text-[16px]">10</p>
          </button>
          <button className="flex gap-2 items-center">
            <FiHeart />
            <p className="text-[16px]">566</p>
          </button>
          <button className="flex gap-2 items-center">
            <IoStatsChartSharp />
            <p className="text-[16px]">10</p>
          </button>
          <div className="flex gap-4 justify-between">
            <button className="flex gap-2 items-center">
              <FiShare className="text-xl" />
            </button>
          </div>
        </div>
        <div className="w-full h-[1px] bg-gray-600" />

        <div className="rounded-2xl items-start justify-start max-h-[30rem] flex px-2 py-5 w-full gap-4 overflow-y-auto">
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
        <div className="w-full h-[1px] bg-gray-600" />
        <div className="w-full">
          {post.timeline &&
            post.timeline
              .slice(post && post.nestedComment)
              .map((comment) => <Comments key={comment._id} post={comment} />)}
        </div>
      </div>
    </>
  );
};

export default PostPage;
