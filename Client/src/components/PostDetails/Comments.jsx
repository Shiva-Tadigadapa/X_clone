import React from "react";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import { FiHeart, FiShare } from "react-icons/fi";
import { IoStatsChartSharp, IoBookmarksOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

const Comments = ({ post, nested, hiddenData }) => {
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

  const calHeightRef = useRef(null);
  const [calHeight, setCalHeight] = useState(0);
  useEffect(() => {
    if (calHeightRef.current) {
      setCalHeight(calHeightRef.current.clientHeight + 12);
    }
  }, [post]);
  // console.log(post, "podsdsdsdsst");
  return (
    <>
      <div
        className={`flex flex-col border-b  w-full border-[#2f3336] items-start  gap-2 ${
          nested && nested ? "px-0 mt-2" : "px-6 py-3"
        }`}
      >
        <div className="flex items-start w-full justify-start gap-3">
          <img
            src={post.user && post.user.profilePicture}
            className="h-10 w-10 mt-2 rounded-full"
            alt="profile"
          />
          <div className="flex flex-col items-start justify-center">
            <div className="items-center flex gap-2">
              <Link to={`/profile/${post.user && post.user.handle}`}>
                <h1 className="text-lg font-semibold">
                  {(post.user && post.user.username) || ""}
                </h1>
              </Link>
              <Link to={`/profile/${(post.user && post.user.handle) || ""}`}>
                <p className="text-gray-500">
                  @{(post.user && post.user.handle) || ""}
                </p>
              </Link>
            </div>
            <Link
              to={{
                pathname: `/${(post.user && post.user.handle) || ""}/post/${
                  post._id
                }`,
                state: { hiddenData: hiddenData },
              }}
            >
              <div>
                <p className=" text-lg ">{post?.comment}</p>
                {renderImages()}
              </div>
            </Link>
          </div>
        </div>
        <div className="text-gray-500 flex   justify-around ml-3 w-full">
          <button className="flex gap-2 items-center">
            <FaRegComment />
            <p>{0}</p>
          </button>
          <button className="flex gap-2 items-center">
            <FaRetweet />
            <p>10</p>
          </button>
          <button className="flex gap-2 items-center">
            <FiHeart />
            <p>{0}</p>
          </button>
          <button className="flex gap-2 items-center">
            <IoStatsChartSharp />
            <p>10</p>
          </button>
          <div className="flex gap-4 justify-between">
            <button className="flex gap-2 items-center">
              <IoBookmarksOutline />
            </button>
            <button className="flex gap-2 items-center">
              <FiShare />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Comments;
