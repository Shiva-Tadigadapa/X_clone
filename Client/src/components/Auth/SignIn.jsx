import React, { useState, useEffect } from "react";
import AuthSection from "./AuthUtils/AuthSection";
import SignUp from "./SignUp";

const SignIn = ({ type, CraModal, handleCraModalUpdate }) => {
  const [user, setUser] = useState(null);
  const [CraModal2, setCraModal2] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-[15rem]  h-screen w-full">
        <div className="hidden ml-36  lg:block h-[20rem] w-[20rem]">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="">
            <g>
              <path
                fill="white"
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              ></path>
            </g>
          </svg>
        </div>
        <div className=" flex flex-col items-start">
          <div className="flex flex-col gap-10 mb-6">
            <h1 className="text-6xl font-extrabold tracking-wide text-[#e7e9ea]">
              Happening now
            </h1>
            <h2 className="text-3xl font-bold">Join today.</h2>
          </div>
          <AuthSection
            CraModal2={CraModal2}
            setCraModal2={setCraModal2}
            handleCraModalUpdate={handleCraModalUpdate}
          />
        </div>
      </div>

      {CraModal && type === "signup" && (
        <SignUp
          type={type}
          setCraModal2={setCraModal2}
          handleCraModalUpdate={handleCraModalUpdate}
          CraModal2={CraModal2}
        />
      )}

      {CraModal && type === "login" && (
        <SignUp
          type={type}
          setCraModal2={setCraModal2}
          handleCraModalUpdate={handleCraModalUpdate}
          CraModal2={CraModal2}
        />
      )}
    </>
  );
};

export default SignIn;
