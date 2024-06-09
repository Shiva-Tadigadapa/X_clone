import React from "react";
import { FaRegComment } from "react-icons/fa";
import { FaRetweet } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { IoStatsChartSharp } from "react-icons/io5";
import { IoBookmarksOutline } from "react-icons/io5";
import { FiShare } from "react-icons/fi";
import { Link } from "react-router-dom";

const FeedPost = ({ post, userProfile }) => {
  const commentCount = post.comments ? post.comments.length : 0;
  const likeCount = post.likes ? post.likes.length : 0;
  // console.log("post:",  post.likes);

  // console.log('userProfile:', userProfile.username);
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
  const setHandle = (username) => {
    return username.split(" ").join("").toLowerCase();
  };
  return (
    <div className="flex flex-col border-b w-full border-[#2f3336] items-start py-5 gap-3 px-6">
      <div className="flex items-start justify-center gap-3">
        <img
          src={
            (post.author && post.author.profilePicture) ||
            (userProfile && userProfile.profilePicture) ||
            ""
          }
          className="h-10 w-10 mt-2 rounded-full"
          alt="profile"
        />
        <div className="flex flex-col items-start justify-center">
          <div className="items-center flex gap-2">
            <Link
              to={`/profile/${
                (post.author && post.author.username) ||
                (userProfile && userProfile.username)
              }`}
            >
              <h1 className="text-lg font-semibold">
                {(post.author && post.author.username) ||
                  (userProfile && userProfile.username)}
              </h1>
            </Link>
            <Link
              to={`/profile/${
                (post.author && post.author.username) ||
                (userProfile && userProfile.username)
              }`}
            >
              <p className="text-gray-500">
                @
                {(post.author && post.author.username) ||
                  (userProfile && userProfile.username)}
              </p>
            </Link>
          </div>
          <p>{post.content}</p>
          {renderImages()}
        </div>
      </div>
      <div className="text-gray-500 flex justify-around ml-3 w-full">
        <button className="flex gap-2 items-center">
          <FaRegComment />
          <p>{commentCount}</p>
        </button>
        <button className="flex gap-2 items-center">
          <FaRetweet />
          <p>10</p>
        </button>
        <button className="flex gap-2 items-center">
          <FiHeart />
          <p>{likeCount}</p>
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
  );
};

export default FeedPost;
