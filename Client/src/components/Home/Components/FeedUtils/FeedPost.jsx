import React, { useState, useEffect } from "react";
import { FaRegComment } from "react-icons/fa";
import { FaRetweet } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { IoStatsChartSharp } from "react-icons/io5";
import { IoBookmarksOutline } from "react-icons/io5";
import { FiShare } from "react-icons/fi";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import ComposePost from "../../../ComposePost";

const FeedPost = ({ post, userProfile }) => {
  const commentCount = post.comments ? post.comments.length : 0;
  const likeCount = post.likes ? post.likes.length : 0;
  const [composeModal, setComposeModal] = useState(false);

  const openComposeModal = () => {
    setComposeModal(true);
  };

  useEffect(() => {
    if (composeModal) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    // Cleanup the effect
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [composeModal]);

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
    <>
      <div className="flex flex-col  hover:bg-[#181818] border-b w-full border-[#2f3336] items-start py-5 gap-3 px-6">
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
                  (post.author && post.author.handle) ||
                  (userProfile && userProfile.handle)
                }`}
              >
                <h1 className="text-lg font-semibold">
                  {(post.author && post.author.username) ||
                    (userProfile && userProfile.username)}
                </h1>
              </Link>
              <Link
                to={`/profile/${
                  (post.author && post.author.handle) ||
                  (userProfile && userProfile.handle)
                }`}
              >
                <p className="text-gray-500">
                  @
                  {(post.author && post.author.handle) ||
                    (userProfile && userProfile.handle)}
                </p>
              </Link>
            </div>
            <Link
              to={`/${
                (post.author && post.author.handle) ||
                (userProfile && userProfile.handle)
              }/post/${post._id}`}
            >
              <div>
                <p className=" text-lg mt-1">{post?.content}</p>
                {renderImages()}
              </div>
            </Link>
          </div>
        </div>
        <div className="text-gray-500 flex justify-around ml-3 w-full">
          <Link
            to="/compose/post/"
            onClick={() => {
              openComposeModal();
            }}
          >
            <button className="flex gap-2 items-center">
              <FaRegComment />
              <p>{commentCount}</p>
            </button>
          </Link>
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

      {composeModal && (
        <div className="fixed top-0  z-[1] rounded-3xl left-0 w-full h-full bg-[#242d34] bg-opacity-60 flex-col flex items-center justify-start">
          <div className=" relative    items-start justify-start w-[50%] py-5 mt-20   flex flex-col    bg-black rounded-2xl">
            <Link
              to="/home"
              onClick={() => {
                setComposeModal(false);
              }}
            >
              <div className=" top-3 z-[1]  absolute left-3">
                <IoClose className="text-white text-2xl" />
              </div>
            </Link>
            <ComposePost post={post} />
          </div>
        </div>
      )}
    </>
  );
};

export default FeedPost;
