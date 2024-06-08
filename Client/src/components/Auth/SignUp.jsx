import React from "react";
import { IoClose } from "react-icons/io5";
import IconTweet from "../../assets/Twitter-new-logo.jpg";
import { Link } from "react-router-dom";

const SignUp = ({ CraModal2, setCraModal2, handleCraModalUpdate }) => {
  return (
    <>
      <div className=" absolute top-0 left-0 w-full h-full bg-[#242d34] bg-opacity-60 flex items-center justify-center">
        {CraModal2 ? (
          <div className=" bg-black w-[40%]  relative h-[70%] px-4 flex  items-start justify-center  py-5 rounded-2xl">
            <div
              className="  absolute left-3"
              onClick={() => (setCraModal2(false), handleCraModalUpdate)}
            >
              <IoClose className="text-white text-3xl" />
            </div>
            <div className=" w-[75%]  flex flex-col  gap-5">
              <img
                src={IconTweet}
                alt="icon"
                className=" w-14 h-14  -mt-3 mx-auto "
              />
              <div className=" flex flex-col gap-5">
                <h1 className=" text-3xl font-semibold">
                  Enter your Crendentials
                </h1>
                <div className=" flex flex-col gap-4">
                  <input
                    type="text"
                    //add a text limit to 6

                    placeholder="Verification Code sent to email"
                    className=" w-full h-10   border-b py-6 px-4 border-[#2f3336] bg-transparent  focus:outline-none text-white mt-4 "
                  />
                  <input
                    type="password"
                    placeholder="Create Your Password"
                    className=" w-full h-10   border-b py-6 px-4 border-[#2f3336] bg-transparent  focus:outline-none text-white mt-4 "
                  />
                </div>
                <button className=" w-full h-12 rounded-full  bg-white/50 text-black text-lg font-bold mt-4">
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className=" bg-black w-[40%]  relative h-[70%] px-4 flex  items-start justify-center  py-5 rounded-2xl">
            <Link to="/">
              <div className="  absolute left-3">
                <IoClose className="text-white text-3xl" />
              </div>
            </Link>
            <div className=" w-[75%]  flex flex-col  gap-5">
              <img
                src={IconTweet}
                alt="icon"
                className=" w-14 h-14  -mt-3 mx-auto "
              />
              <div className=" flex flex-col gap-5">
                <h1 className=" text-3xl font-semibold">Create Your Account</h1>
                <div>
                  <input
                    type="text"
                    placeholder="Username"
                    className=" w-full h-10 rounded-lg  border py-6 px-4 border-[#2f3336] bg-transparent  focus:outline-none text-white mt-4 "
                  />
                  <input
                    type="text"
                    placeholder="Email"
                    className=" w-full h-10 rounded-lg  border py-6 px-4 border-[#2f3336] bg-transparent  focus:outline-none text-white mt-4 "
                  />
                </div>
                <button
                  className=" w-full h-12 rounded-full  bg-white/50 text-black text-lg font-bold mt-4"
                  onClick={() => (setCraModal2(true), handleCraModalUpdate)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SignUp;
