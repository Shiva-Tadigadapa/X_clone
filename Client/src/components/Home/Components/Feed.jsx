import React from "react";
import { useMainDashContext } from "../../../Context/AppContext";
import NewPost from "./FeedUtils/NewPost";

import FeedPost from "./FeedUtils/FeedPost";
const Feed = () => {
  const { authUser } = useMainDashContext();
  console.log(authUser);
  return (
    <>
      <div className=" flex items-start  flex-col w-full  ">
        <div className=" text-lg font-semibold flex  bg-black/30  backdrop-blur-md flex-col pt-5  sticky top-0  w-full items-center  justify-center">
          <div className=" flex w-full justify-around">
            <button className="  ">For You </button>
            <button className="  ">Following</button>
          </div>
          <div className=" bg-[#2f3336] mt-3 h-[1px] w-full " />
        </div>
        <NewPost />
        <div className=" bg-[#2f3336] h-[1px] w-full " />
        <div className="   w-full flex  items-center  py-2.5 justify-center">
          <h1 className=" text-[#1d9bf0]   text-lg ">Show 105 posts</h1>
        </div>
        <div className=" bg-[#2f3336] h-[1px] w-full " />

        <FeedPost />
        <FeedPost />
        <FeedPost />
        <FeedPost />

        <div className=" bg-[#2f3336] h-[1px] w-full " />
      </div>
    </>
  );
};

export default Feed;
