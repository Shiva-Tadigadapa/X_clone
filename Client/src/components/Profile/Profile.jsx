import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { GrLocation } from "react-icons/gr";
import { RiLink } from "react-icons/ri";
import { PiBalloon } from "react-icons/pi";
import { PiCalendarDotsDuotone } from "react-icons/pi";
import FeedPost from "../Home/Components/FeedUtils/FeedPost";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useMainDashContext } from "../../Context/AppContext";
import { URL } from "../../../Link";
import ReplieNav from "./utils/ReplieNav";

const Profile = () => {
  const { username } = useParams();
  const { authUser, postRender, setProfileNav, profileNav } =
    useMainDashContext();
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  // const [retweetedComments, setRetweetedComments] = useState([]);
  const [retweetedPosts, setRetweetedPosts] = useState([]);
  const [retweetComments, setRetweetComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${URL}/post/profile/${username}`);
        if (response.data.success) {
          console.log(response.data + "response.data.userProfile");
          setUserProfile(response.data.userProfile);
          setPosts(response.data.userProfile.posts);
          setIsFollowing(
            response.data.userProfile.followers.includes(authUser.userId)
          );
          console.log("response.data.userProfile:", response.data.userProfile);
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUserData();

    const retweetedComments = async () => {
      try {
        const response = await axios.get(
          `${URL}/post/retweetedComments/${userProfile&& userProfile._id}/retweetedComments`
        );
        if (response.data.success) {
          // Extracting only the parent posts from the response data
          const parentPosts =
            response &&
            response.data &&
            response.data.retweetedTweets.map((comment) => comment.parent);
          const commentsPosts =
            response &&
            response.data &&
            response.data.retweetedTweets.map(
              (comment) => comment.savedComment
            );
          setRetweetedPosts(parentPosts);
          setRetweetComments(commentsPosts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    retweetedComments();
  }, [userProfile && userProfile._id, authUser.userId, postRender,username]);

  const setHandle = (username) => {
    return username.split(" ").join("").toLowerCase();
  };

  const handleFollowToggle = async () => {
    setIsFollowLoading(true);
    try {
      const endpoint = isFollowing
        ? `${URL}/post/unfollow/${userProfile._id}`
        : `${URL}/post/follow/${userProfile._id}`;

      const response = await axios.post(endpoint, {
        follower: authUser.userId,
      });

      if (response.data.success) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${URL}/post/profile/checklogin/${authUser && authUser.userId}/${
            userProfile && userProfile._id
          }`
        );
      } catch (error) {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userProfile && userProfile, authUser.userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!userProfile) {
    return <div>No profile found</div>;
  }

  return (
    <>
      <div>
        <div className="px-4 py-2 justify-start sticky top-0 bg-black/70 backdrop-blur-md items-center gap-8 flex">
          <Link to="/home">
            <FaArrowLeft className="text-xl" />
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold">
              {userProfile && userProfile.username}
            </h1>
            <h2 className="text-xs">
              {userProfile && userProfile.posts.length} posts
            </h2>
          </div>
        </div>
        <div>
          <div>
            <img
              src= {userProfile && userProfile.coverPhoto}
              alt="Banner"
            />
          </div>
          <div className="px-4 flex items-end justify-between -mt-20 rounded-full">
            <img
              className="h-36 w-36 rounded-full border-4 border-black"
              src={userProfile && userProfile.profilePicture}
              alt=""
            />
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineDotsHorizontal className="text-2xl border border-gray-500 text-gray-200 w-9 h-9 p-1 rounded-full" />
              <button
                className={`h-10 w-28 font-bold rounded-full ${
                  isFollowing ? "bg-gray-600 text-white" : "bg-white text-black"
                }`}
                onClick={handleFollowToggle}
                disabled={isFollowLoading}
              >
                {isFollowLoading
                  ? "Loading..."
                  : isFollowing
                  ? "Unfollow"
                  : "Follow"}
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 flex flex-col gap-3">
          <div className="leading-5">
            <h1 className="text-xl font-bold">
              {userProfile && userProfile.username}
            </h1>
            <h2 className="text-gray-500 font-semibold">
              @{setHandle(userProfile && userProfile.username)}
            </h2>
          </div>
          <h2 className="font-semibold">Hey there I am using Twitter✌️</h2>
          <div className="flex justify-between px-2">
            <div className="text-gray-500 flex items-center gap-1">
              <GrLocation className="text-lg" />
              <h1 className="font-semibold">India</h1>
            </div>
            <div className="text-blue-300 flex items-center gap-1">
              <RiLink className="text-lg" />
              <h1 className="font-semibold">{userProfile.handle}.com</h1>
            </div>
            <div className="text-gray-500 flex items-center gap-1">
              <PiBalloon className="text-lg" />
              <h1 className="font-semibold">Born September 17</h1>
            </div>
            <div className="text-gray-500 flex items-center gap-1">
              <PiCalendarDotsDuotone className="text-lg" />
              <h1 className="font-semibold">Joined January 2009</h1>
            </div>
          </div>
          <div className="flex gap-5 px-2">
            <h1 className="font-semibold text-md text-gray-500">
              <span className="text-white mr-1">
                {userProfile && userProfile.following.length}
              </span>
              Following
            </h1>
            <h1 className="font-semibold text-md text-gray-500">
              <span className="text-white mr-1">
                {userProfile && userProfile.followers.length}
              </span>
              Followers
            </h1>
          </div>
          <div className="flex w-full justify-around gap-5 mt-3 ">
            <button
              className={`${
                profileNav === "Posts"
                  ? "border-b-4 border-blue-400 bg-blue-600"
                  : ""
              }' font-semibold text-lg'`}
              onClick={() => setProfileNav("Posts")}
            >
              Posts
            </button>
            <button
              className={`${
                profileNav === "Replies"
                  ? "border-b-4 border-blue-400 bg-blue-600"
                  : ""
              }' font-semibold text-lg'`}
              onClick={() => setProfileNav("Replies")}
            >
              Replies
            </button>
            <button
              className={`${
                profileNav === "Likes"
                  ? "border-b-4 border-blue-600 bg-blue-600"
                  : " "
              }' font-semibold text-lg'`}
              onClick={() => setProfileNav("Likes")}
            >
              Likes
            </button>
            <button
              className={`${
                profileNav === "Media"
                  ? "border-b-4 border-blue-400 bg-blue-600"
                  : ""
              }' font-semibold text-lg'`}
              onClick={() => setProfileNav("Media")}
            >
              Media
            </button>
     
          </div>
        </div>
        <div className="w-full  -mt-4 h-[0.5px] bg-gray-500" />
        {profileNav === "Posts" && (
          <>
            {posts.map((post) => (
              <FeedPost
                key={post._id}
                post={post}
                userProfile={userProfile}
                deletePost={true}
              />
            ))}
          </>
        )}
        {profileNav === "Replies" && (
          <>
            {retweetedPosts &&
              retweetedPosts.map((post, index) => (
                <ReplieNav
                  key={post._id}
                  post={post}
                  userProfile={userProfile}
                  retweetComments={retweetComments[index]}
                  deletePost={true}
                />
              ))}
          </>
        )}
        {/* {profileNav === "Likes" } */}
      </div>
    </>
  );
};

export default Profile;
