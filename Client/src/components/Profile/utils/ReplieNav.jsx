import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import heartpng from "../../../assets/heart.png";
import { URL } from "../../../../Link";
import axios from "axios";
import { useMainDashContext } from "../../../Context/AppContext";
import verifipng from "../../../assets/heart.png";
import { MdDelete } from "react-icons/md";
import { toast } from "sonner";
import { useRef } from "react";
const ReplieNav = ({ deletePost, post, userProfile, retweetComments }) => {
  const calHeightRef = useRef(null);
  const { authUser, postRender, setPostRender } = useMainDashContext();
  const commentCount = post.timeline ? post.timeline.length : 0;
  const [likeCount, setLikeCount] = useState(
    post.likes ? post.likes.length : 0
  );
  const [isLiked, setIsLiked] = useState(false);

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


  const renderhrsAgo = (date) => {
    const currentDate = new Date();
    const postDate = new Date(date);
    const diff = currentDate - postDate;
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
  const [calHeight, setCalHeight] = useState(0);
  useEffect(() => {
    if (calHeightRef.current) {
      setCalHeight(calHeightRef.current.clientHeight);
    }
  }, [post]);
  return (
    <>
      <div className="flex flex-col hover:bg-[#181818] border-b w-full border-[#2f3336] h-full  relative items-start py-5 gap-3 px-6">
        <div
          className="flex items-start flex-col justify-center gap-3 w-full"
          ref={calHeightRef}
        >
          <div className=" flex items-start   justify-center gap-3 w-full">
            <div className=" flex flex-col items-center gap-2">
              <div
                className=" bg-gray-500 w-0.5  absolute   mt-14 "
                style={{ height: `${(calHeight && calHeight) - 35}px` }}
              />
              <img
                src={
                  (post.author && post.author.profilePicture) ||
                  (userProfile && userProfile.profilePicture) ||
                  ""
                }
                className="h-10  w-10 mt-2 rounded-full"
                alt="profile"
              />
            </div>
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
                  <div className=" flex items-center  gap-2 ">
                    <p className="text-lg mt-1">{post?.content}</p>
                    <p className=" text-lg text-blue-500 mt-1.5">
                      {post.hashtags && post.hashtags.map((tag) => `#${tag} `)}
                    </p>
                  </div>
                  {renderImages()}
                </div>
              </Link>
            </div>
          </div>
        </div>
        {/* {post.comments.map((comment) => ( */}
        <div className="   mt-1">
          <div className="flex items-start flex-col justify-center gap-3 w-full">
            <div className=" flex items-start   justify-center gap-3 w-full">
              <div className=" flex flex-col items-center gap-2">
                <img
                  src={
                    retweetComments.user && retweetComments.user.profilePicture
                  }
                  className="h-10  w-12 mt-2 rounded-full"
                  alt="profile"
                />
              </div>
              <div className="flex flex-col items-start w-full  justify-center">
                <div className="items-center  justify-between w-full flex gap-2">
                  <div className=" flex items-start  gap-2 ">
                    <div>
                      <Link
                        to={`/profile/${
                          retweetComments.user && retweetComments.user.handle
                        }`}
                      >
                        <h1 className="text-lg font-semibold hover:underline">
                          {retweetComments.user &&
                            retweetComments.user.username}
                        </h1>
                      </Link>
                      <Link
                        to={`/profile/${
                          retweetComments.user && retweetComments.user.handle
                        }`}
                      >
                        <p className="text-gray-500 hover:underline">
                          @{retweetComments.user && retweetComments.user.handle}
                        </p>
                      </Link>
                    </div>
                    <img src={verifipng} className=" w-5 h-5 mt-1.5" alt="" />
                  </div>
                  <div className="  flex gap-2 ">
                    <p className="text-gray-500">
                      {retweetComments.createdAt &&
                        renderhrsAgo(retweetComments.createdAt)}{" "}
                      ago
                    </p>
                    {retweetComments.user._id == authUser.userId && (
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
                    retweetComments.user && retweetComments.user.handle
                  }/post/${retweetComments._id}`}
                >
                  <div>
                    <div className=" flex items-center  gap-2 ">
                      <p className="text-lg mt-1">{retweetComments?.comment}</p>
                      <p className=" text-lg text-blue-500 mt-1.5">
                        {retweetComments.hashtags &&
                          post.hashtags.map((tag) => `#${tag} `)}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* ))} */}
      </div>

    
    </>
  );
};

export default ReplieNav;