import React, { useEffect, useState } from "react";
import { useMainDashContext } from "../../../Context/AppContext";
import NewPost from "./FeedUtils/NewPost";
import FeedPost from "./FeedUtils/FeedPost";
import axios from "axios";

const Feed = ({ Section, posts }) => {
  const { authUser } = useMainDashContext();

  return (
    <div className={`flex items-start flex-col w-full`}>
      <div className="text-lg font-semibold flex bg-black/30 backdrop-blur-md flex-col pt-5 sticky top-0 w-full items-center justify-center">
        <div className="flex w-full justify-around">
          <button>For You</button>
          <button>Following</button>
        </div>
        <div className="bg-[#2f3336] mt-3 h-[1px] w-full" />
      </div>
      <NewPost />
      <div className="bg-[#2f3336] h-[1px] w-full" />
      <div className="w-full flex items-center py-2.5 justify-center">
        <h1 className="text-[#1d9bf0] text-lg">Show {posts.length} posts</h1>
      </div>
      <div className="bg-[#2f3336] h-[1px] w-full" />
      {posts.map((post) => (
        <FeedPost key={post._id} post={post} />
      ))}
      <div className="bg-[#2f3336] h-[1px] w-full" />
    </div>
  );
};

export default Feed;
