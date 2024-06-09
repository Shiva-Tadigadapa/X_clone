import React from "react";
import Feed from "./Components/Feed";
import Happening from "./Components/Happening";
import SideSection from "./Components/SideSection";
import NewPost from "./Components/FeedUtils/NewPost";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Profile from "../Profile/Profile";

const Home = ({ Section }) => {
  return (
    <>
      <div
        className={` ${
          Section === "newPost" ? " fixed  bg-black" : ""
        } flex justify-between h-full items-start`}
      >
        <div className="h-screen border-[#2f3336] border-r sticky top-0">
          <SideSection />
        </div>
        {Section && Section === "profile" ? (
          <Profile/>
        ) : (
          <Feed Section={Section} />
        )}
        <Happening />
      </div>

      {Section && Section === "newPost" && (
        <div className="fixed top-0  rounded-3xl left-0 w-full h-full bg-[#242d34] bg-opacity-60 flex-col flex items-center justify-start">
          <div className=" relative px-4  py-5 mt-20   flex flex-col   w-[50%] bg-black rounded-2xl">
            <Link to="/home">
              <div className=" top-3  absolute left-3">
                <IoClose className="text-white text-2xl" />
              </div>
            </Link>
            <NewPost />
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
