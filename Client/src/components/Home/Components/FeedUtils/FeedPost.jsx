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
import heartpng from "../../../../assets/heart.png";
import { URL } from "../../../../../Link";
import axios from "axios";
import { useMainDashContext } from "../../../../Context/AppContext";
import verifipng from "../../../../assets/verifi.png";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
const FeedPost = ({ deletePost, post, userProfile }) => {
  // console.log(post,"djsjhdjshj");
  const { authUser, postRender, setPostRender } = useMainDashContext();
  const commentCount = post.timeline ? post.timeline.length : 0;
  console.log(post.timeline.length);
  console.log(post.author._id == authUser.userId, "fdfdjfjdhh");
  const [likeCount, setLikeCount] = useState(
    post.likes ? post.likes.length : 0
  );
  const [composeModal, setComposeModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [retweet, setRetweet] = useState(false);

  useEffect(() => {
    // Check localStorage for like status
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};
    setIsLiked(likedPosts[post._id] || false);
  }, [post._id]);

  const handleLike = () => {
    // Update like count immediately
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    setIsLiked(!isLiked);

    // Update localStorage accordingly
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};
    if (isLiked) {
      delete likedPosts[post._id];
    } else {
      likedPosts[post._id] = true;
    }
    localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

    // Make POST request to update server asynchronously
    const postLikes = async () => {
      try {
        await axios.post(`${URL}/post/${post._id}/like`, {
          userId: authUser.userId,
        });
      } catch (error) {
        console.error(error);
      }
    };
    postLikes();
  };

  const openComposeModal = () => {
    setComposeModal(true);
  };

  useEffect(() => {
    if (composeModal) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
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

  const RetweetPost = async (postId) => {
    try {
      await axios.post(`${URL}/post/${postId}/retweet`, {
        userId: authUser.userId,
      });
      setPostRender(!postRender);
    } catch (error) {
      console.error(error);
    }
  };

  const renderhrsAgo = (date) => {
    const currentDate = new Date();
    const postDate = new Date(date);
    const diff = currentDate - postDate;
    console.log(diff, "diff")
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  const deletePostById = async (postId) => {
    try {
      await axios.delete(`${URL}/post/${postId}/delete`);
      setPostRender(!postRender);
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col hover:bg-[#181818] border-b w-full border-[#2f3336] items-start py-5 gap-3 px-6">
        <div className="flex items-start justify-center gap-3 w-full">
          <img
            src={
              (post.author && post.author.profilePicture) ||
              (userProfile && userProfile.profilePicture) ||
              ""
            }
            className="h-10 w-10 mt-2 rounded-full"
            alt="profile"
          />
          <div className="flex flex-col items-start w-full  justify-center">
            <div className="items-center  justify-between w-full flex gap-2">
              <div className=" flex items-start  gap-2 ">
                <div>
                  <Link
                    to={`/profile/${
                      (post.author && post.author.handle) ||
                      (userProfile && userProfile.handle)
                    }`}
                  >
                    <h1 className="text-lg font-semibold hover:underline">
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
                    <p className="text-gray-500 hover:underline">
                      @
                      {(post.author && post.author.handle) ||
                        (userProfile && userProfile.handle)}
                    </p>
                  </Link>
                </div>
                <img src={verifipng} className=" w-5 h-5 mt-1.5" alt="" />
              </div>
              <div className="  flex gap-2 ">
                <p className="text-gray-500">
                  {post.createdAt && renderhrsAgo(post.createdAt)} ago
                </p>
                {(post.author._id == authUser.userId ||
                  post.author == authUser.userId) && (
                  <MdDelete
                    onClick={() => deletePostById(post._id)}
                    className="text-red-400 text-2xl cursor-pointer"
                  />
                )}
                {/* <MdDelete onClick={()=>deletePost(post._id)} className="text-red-400 text-2xl cursor-pointer" /> */}
              </div>
            </div>
            <Link
              to={`/${
                (post.author && post.author.handle) ||
                (userProfile && userProfile.handle)
              }/post/${post._id}`}
            >
              <div>
                <div className=" flex items-start  flex-col gap-2 ">
                  <p className="text-lg mt-1 whitespace-pre-wrap">{post?.content}</p>
                  <p className=" text-lg text-blue-500 mt-1.5">
                    {post.hashtags && post.hashtags.map((tag) => `#${tag} `)}
                  </p>
                </div>
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

          <button
            className="flex gap-2 items-center"
            style={{ color: retweet ? "#005d96" : "inherit" }}
            onClick={() => {
              RetweetPost(post._id);
              setRetweet(true);
            }}
          >
            <FaRetweet />
            <p>{post && post.retweets}</p>
          </button>
          <button className="flex gap-2 items-center" onClick={handleLike}>
            {isLiked ? (
              <>
                <img src={heartpng} className="h-5 w-5" />

                <p>{likeCount}</p>
              </>
            ) : (
              <>
                <FiHeart style={{ color: isLiked ? "red" : "inherit" }} />
                <p>{likeCount}</p>
              </>
            )}
          </button>
          <button className="flex gap-2 items-center">
            <IoStatsChartSharp />
            <p>{post && post.views}</p>
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
        <div className="fixed top-0 z-[1] rounded-3xl left-0 w-full h-full bg-[#242d34] bg-opacity-60 flex-col flex items-center justify-start">
          <div className="relative items-start justify-start w-[50%] py-5 mt-20 flex flex-col bg-black rounded-2xl">
            <Link
              to="/home"
              onClick={() => {
                setComposeModal(false);
              }}
            >
              <div className="top-3 z-[1] absolute left-3">
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
