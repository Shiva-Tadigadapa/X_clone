import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { GrLocation } from "react-icons/gr";
import { RiLink } from "react-icons/ri";
import { PiBalloon } from "react-icons/pi";
import { PiCalendarDotsDuotone } from "react-icons/pi";

const Profile = () => {
  return (
    <>
      <div>
        <div className=" p-4 justify-start sticky top-0  items-center gap-8 flex">
          <FaArrowLeft className="text-xl" />
          <div>
            <h1 className=" text-xl font-bold">Narendra Modi</h1>
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
              src="https://pbs.twimg.com/profile_images/1700051019525488640/VRqy0bTE_400x400.jpg"
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
            <h1 className=" text-xl font-bold ">Narendra Modi</h1>
            <h2 className="   text-gray-500  font-semibold">@narendramodi</h2>
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
        </div>
      </div>
    </>
  );
};

export default Profile;
