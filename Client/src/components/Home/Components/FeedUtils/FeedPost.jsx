import React from "react";
import img from "../../../../assets/img.jpeg";
import { FaRegComment } from "react-icons/fa";
import { FaRetweet } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { IoStatsChartSharp } from "react-icons/io5";
import { IoBookmarksOutline } from "react-icons/io5";
import { FiShare } from "react-icons/fi";
import { useMainDashContext } from "../../../../Context/AppContext";
const FeedPost = () => {
  const { authUser } = useMainDashContext();
  return (
    <>
      <div className=" flex flex-col border-b border-[#2f3336]  items-start py-5 gap-3 px-6">
        <div className=" flex items-start  justify-center gap-3">
          <img
            src={authUser?.picture}
            className="h-10 w-10 mt-2 rounded-full"
            alt="profile"
          />

          <div className=" flex  flex-col  items-start justify-center ">
            <div className="  items-center flex  gap-2">
              <h1 className=" text-lg font-semibold">{authUser?.name}</h1>
              <p className=" text-gray-500">@{authUser?.email}</p>
            </div>
            <p>You've done your part.</p>
            <img src={img} className=" rounded-3xl mt-4 " alt="tweet" />
          </div>
        </div>
        <div className=" text-gray-500 flex justify-around ml-3 w-full">
          <button className=" flex gap-2 items-center">
            <FaRegComment />
            <p>10</p>
          </button>
          <button className=" flex gap-2 items-center">
            <FaRetweet />
            <p>10</p>
          </button>
          <button className=" flex gap-2 items-center">
            <FiHeart />
            <p>10</p>
          </button>
          <button className=" flex gap-2 items-center">
            <IoStatsChartSharp />
            <p>10</p>
          </button>
          <div className=" flex  gap-4 justify-between">
            <button className=" flex gap-2 items-center">
              <IoBookmarksOutline />
            </button>
            <button className=" flex gap-2 items-center">
              <FiShare />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedPost;
