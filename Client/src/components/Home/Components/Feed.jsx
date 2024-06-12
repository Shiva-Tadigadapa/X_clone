import React, { useEffect, useState } from "react";
import { useMainDashContext } from "../../../Context/AppContext";
import NewPost from "./FeedUtils/NewPost";
import FeedPost from "./FeedUtils/FeedPost";
import axios from "axios";
import { URL } from "../../../../Link";

const Feed = ({ Section, posts,followingPosts }) => {
  const { authUser, feedNav, setFeedNav } = useMainDashContext();
  return (
    <>
      <div className={`flex items-start flex-col w-full`}>
        <div className="text-lg font-semibold flex bg-black/30 backdrop-blur-md flex-col sticky top-0 w-full items-center justify-center">
          <div className="flex w-full   items-center justify-between ">
            <div
              className="flex items-center justify-center cursor-pointer  w-full pt-3  backdrop-blur-md hover:backdrop-blur-sm hover:bg-[#181818]/90"
              onClick={() => setFeedNav("For You")}
            >
              <button
                className={`${
                  feedNav === "For You"
                    ? "border-b-4 border-[#1d9bf0]    "
                    : "border-b-0"
                } pb-2`}
              >
                For You
              </button>
            </div>
            <div
              className="pt-3  w-full flex items-center justify-center cursor-pointer backdrop-blur-md hover:backdrop-blur-sm hover:bg-[#181818]/90"
              onClick={() => setFeedNav("Following")}
            >
              <button
                className={`${
                  feedNav === "Following"
                    ? "border-b-4 border-[#1d9bf0]"
                    : "border-b-0"
                } pb-2`}
              >
                Following
              </button>
            </div>
          </div>
          <div className="bg-[#2f3336]  h-[1px] w-full" />
        </div>
        <NewPost />
        <div className="bg-[#2f3336] h-[1px] w-full" />
        {feedNav === "For You" && (
          <>
            <div className="w-full flex items-center py-2.5 justify-center hover:bg-[#181818] cursor-pointer">
              <h1 className="text-[#1d9bf0] text-lg">
                Showing {posts.length} posts
              </h1>
            </div>
            <div className="bg-[#2f3336] h-[1px] w-full" />
            {posts.map((post) => (
              <FeedPost key={post._id} post={post} />
            ))}
            <div className="bg-[#2f3336] h-[1px] w-full" />
          </>
        )}
        {feedNav === "Following" && (
          <>
            <div className="w-full flex items-center py-2.5 justify-center hover:bg-[#181818] cursor-pointer">
              <h1 className="text-[#1d9bf0] text-lg">
                Showing {followingPosts&&followingPosts.length} posts
              </h1>
            </div>
            <div className="bg-[#2f3336] h-[1px] w-full" />
            {followingPosts&&followingPosts.map((post) => (
              <FeedPost key={post._id} post={post} />
            ))}
            <div className="bg-[#2f3336] h-[1px] w-full" />
          </>
        )  
        }
      </div>
    </>
  );
};

export default Feed;
