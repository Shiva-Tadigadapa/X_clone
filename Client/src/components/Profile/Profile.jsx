import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { GrLocation } from "react-icons/gr";
import { RiLink } from "react-icons/ri";
import { PiBalloon } from "react-icons/pi";
import { PiCalendarDotsDuotone } from "react-icons/pi";
import Feed from "../Home/Components/Feed";
import FeedPost from "../Home/Components/FeedUtils/FeedPost";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const Profile = ({}) => {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/post/profile/${username}`
        );

        if (response.data.success) {
          setUserProfile(response.data.userProfile);
          setPosts(response.data.userProfile.posts);
        }

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!userProfile) {
    return <div>No profile found</div>;
  }
  // if (error) return <div>Error: {error.message}</div>;
  const setHandle = (username) => {
    return username.split(" ").join("").toLowerCase();
  };
  return (
    <>
      <div>
        <div className=" px-4 py-2 justify-start  sticky top-0  bg-black/70 backdrop-blur-md items-center gap-8 flex">
          <Link to="/home">
            <FaArrowLeft className="text-xl" />
          </Link>
          <div className=" flex flex-col gap-1">
            <h1 className=" text-xl font-bold">
              {userProfile && userProfile.username}
            </h1>
            <h2 className=" text-xs">42.7K posts</h2>
          </div>
        </div>
        <div>
          <div>
            <img src="https://pbs.twimg.com/profile_banners/18839785/1694158725/1500x500" />
          </div>
          <div className="  px-4 flex items-end justify-between -mt-20 rounded-full  ">
            <img
              className="h-36 w-36 rounded-full  border-4 border-black"
              src={userProfile && userProfile.profilePicture}
              alt=""
            />
            <div className="flex  items-center gap-2  mb-2 ">
              <HiOutlineDotsHorizontal className="text-2xl  border border-gray-500 text-gray-200 w-9 h-9 p-1 rounded-full" />
              <button className=" bg-white text-black h-10 w-28  font-bold rounded-full ">
                Follow
              </button>
            </div>
          </div>
        </div>
        <div className=" p-4 flex flex-col gap-3">
          <div className="leading-5">
            <h1 className=" text-xl font-bold ">
              {userProfile && userProfile.username}
            </h1>
            <h2 className="   text-gray-500  font-semibold">
              @{setHandle(userProfile && userProfile.username)}
            </h2>
          </div>
          <h2 className=" font-semibold">Prime Minister of India</h2>
          <div className=" flex justify-between px-2">
            <div className="text-gray-500 flex  items-center  gap-1">
              <GrLocation className="text-lg " />
              <h1 className=" font-semibold">India</h1>
            </div>
            <div className="text-gray-500 flex  items-center  gap-1">
              <RiLink className="text-lg " />
              <h1 className=" font-semibold">narendramodi.com</h1>
            </div>
            <div className="text-gray-500 flex  items-center  gap-1">
              <PiBalloon className="text-lg " />
              <h1 className=" font-semibold">Born September 17</h1>
            </div>
            <div className="text-gray-500 flex  items-center  gap-1">
              <PiCalendarDotsDuotone className="text-lg " />
              <h1 className=" font-semibold">Joined January 2009</h1>
            </div>
          </div>
          <div className=" flex gap-5 px-2">
            <h1 className="  font-semibold  text-md text-gray-500">
              <span className=" text-white  mr-1">2,674</span>
              Following
            </h1>
            <h1 className="  font-semibold  text-md text-gray-500">
              <span className=" text-white  mr-1">98.6M</span>
              Followers
            </h1>
          </div>
          <div className=" flex  w-full justify-around gap-5 mt-3   ">
            <button className=" font-semibold  text-lg ">Posts</button>
            <button className=" font-semibold  text-lg ">Replies</button>
            <button className=" font-semibold  text-lg ">Media</button>
            <button className=" font-semibold  text-lg ">Likes</button>
          </div>
        </div>
        <div className="w-full -mt-2 h-[0.5px] bg-gray-500" />
        {posts.map((post) => (
          <FeedPost key={post._id} post={post} userProfile={userProfile} />
        ))}
      </div>
    </>
  );
};

export default Profile;
