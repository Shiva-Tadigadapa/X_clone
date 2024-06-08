import React from "react";
import { PiImageSquare } from "react-icons/pi";
import { MdOutlineGifBox } from "react-icons/md";
import { CgOptions } from "react-icons/cg";
import { BsEmojiSmile } from "react-icons/bs";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { useMainDashContext } from "../../../../Context/AppContext";
const NewPost = () => {
  const { authUser } = useMainDashContext();
  return (
    <>
      <div className=" flex  px-10 py-5  w-full gap-4">
        <img
          src={authUser?.picture}
          className="h-10 w-10 rounded-full"
          alt="profile"
        />
        <div className="  w-full ">
          <input
            type="text"
            placeholder="What's happening?"
            className="w-full h-10 text-2xl  border-none active:outline-none outline-none  focus:border-none  bg-transparent text-white"
          />

          <h1 className=" text-[#1d9bf0] font-semibold">Every one can reply</h1>
          <div className=" bg-[#2f3336] h-[1px] mt-4 -ml-4 w-full " />
          <div className=" w-full  mt-2">
            <div className=" flex items-center justify-between gap-4">
              <div className=" flex gap-4">
                <button className=" flex  items-center">
                  <PiImageSquare className=" text-[22px] font-bold text-[#1d9bf0]" />
                </button>
                <button className=" flex items-center">
                  <MdOutlineGifBox className=" text-[22px] font-bold text-[#1d9bf0]" />
                </button>
                <button className=" flex items-center">
                  <CgOptions className=" text-[22px] font-bold text-[#1d9bf0]" />
                </button>
                <button className=" flex items-center">
                  <BsEmojiSmile className=" text-[20px] font-bold text-[#1d9bf0]" />
                </button>
                <button className=" flex items-center">
                  <RiCalendarScheduleLine className=" text-[20px] font-bold text-[#1d9bf0]" />
                </button>
              </div>
              <button className=" bg-[#1d9bf0] opacity-60 h-10 w-20 rounded-full text-lg items-center flex justify-center text-white font-semibold">
                <h1>Post</h1>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPost;
