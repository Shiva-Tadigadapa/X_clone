import React from 'react';
import { FaApple } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { IoLockClosedOutline } from 'react-icons/io5';
import { GoogleLogin } from 'react-google-login';

const SignUp = () => {
  const svg = (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="">
      <g>
        <path
          fill="white"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        ></path>
      </g>
    </svg>
  );

  const handleGoogleSuccess = async (response) => {
    console.log('Google Login Success:', response);
    const tokenId = response.tokenId;

    try {
      const res = await fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: tokenId }),
      });
      const data = await res.json();
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleGoogleFailure = (response) => {
    if (response.error === 'popup_closed_by_user') {
      console.warn('Google Login was closed before completion.');
    } else {
      console.error('Google Login Failure:', response);
    }
  };

  return (
    <div className="flex items-center justify-around gap-10 h-screen w-full">
      <div className="hidden lg:block h-[20rem] w-[20rem]">{svg}</div>
      <div className="flex flex-col items-start">
        <div className="flex flex-col gap-10 mb-6">
          <h1 className="text-6xl font-extrabold tracking-wide text-[#e7e9ea]">
            Happening now
          </h1>
          <h2 className="text-3xl font-bold">Join today.</h2>
        </div>
        <div className="gap-10 flex flex-col">
          <div className="text-lg flex flex-col gap-2 font-bold">
            <div className="flex flex-col gap-2">
              <GoogleLogin
                clientId="199764480225-1npvvugr55pmnehika7e2dnkmpv42c01.apps.googleusercontent.com"
                buttonText="Sign up with Google"
                onSuccess={handleGoogleSuccess}
                onFailure={handleGoogleFailure}
                cookiePolicy={'single_host_origin'}
                render={(renderProps) => (
                  <button
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="cursor-pointer w-[20rem] h-12 gap-2 rounded-full bg-white text-black flex items-center justify-center"
                  >
                    <FcGoogle />
                    Sign up with Google
                  </button>
                )}
              />
              <button className="w-[20rem] cursor-pointer gap-2 h-12 items-center justify-center flex rounded-full bg-white text-black">
                <FaApple />
                Sign up with Apple
              </button>
            </div>
            <span className="items-center justify-center flex">or</span>
            <div className="w-[18rem]">
              <button className="w-[20rem] h-12 flex items-center cursor-pointer justify-center rounded-full bg-[#1d9bf0] text-white">
                Create Account
              </button>
              <span className="font-normal tracking-tight line-clamp-4 mt-2 text-xs">
                By signing up, you agree to the Terms of Service and Privacy
                Policy, including Cookie Use.
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">
              Already have an account? Log in
            </span>
            <button className="text-[#1d9bf0] font-bold text-lg gap-2 border-[#536471] border items-center justify-center flex w-[20rem] h-12 rounded-full bg-black">
              <IoLockClosedOutline className="text-gray-500" />
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
