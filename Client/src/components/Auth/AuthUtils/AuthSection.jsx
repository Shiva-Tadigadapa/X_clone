import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useMainDashContext } from "../../../Context/AppContext";
import { Link } from "react-router-dom";
import { IoLockClosedOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import axios from "axios";

const AuthSection = ({ CraModal2, setCraModal, handleCraModalUpdate }) => {
  const { authUser, setAuthUser } = useMainDashContext();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Check for user data in localStorage on component mount
    console.log("Checking for user data in localStorage...,",authUser)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const handleGoogleSuccess = async (response) => {
    console.log("Google Login Success:", response);
    const userObject = jwtDecode(response.credential);

    try {
      const res = await axios.post("http://localhost:3000/api/auth/google", {
        token: response.credential,
        body: JSON.stringify({ token: response.credential }),
      });

      if (res.status === 200) {
        // Backend authentication successful
        console.log("Backend authentication successful:", res.data);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        setAuthUser(res.data.user);
        navigate("/home", { replace: true });
      } else {
        // Backend authentication failed
        console.error("Backend authentication failed:", res.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGoogleFailure = (response) => {
    if (response.error === "popup_closed_by_user") {
      console.warn("Google Login was closed before completion.");
    } else {
      console.error("Google Login Failure:", response);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <>
      <div className="gap-10 flex flex-col">
        <div className="text-lg flex flex-col gap-2 font-bold">
          <div className="flex flex-col gap-2">
            <GoogleOAuthProvider clientId="199764480225-1npvvugr55pmnehika7e2dnkmpv42c01.apps.googleusercontent.com">
              {!user ? (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onFailure={handleGoogleFailure}
                  cookiePolicy="single_host_origin"
                  containerProps={{
                    className:
                      "flex items-center justify-center gap-2 w-[20rem] h-12 bg-white text-black rounded-full border border-gray-300 shadow-sm hover:bg-gray-100 transition duration-300",
                  }}
                  render={(renderProps) => (
                    <button
                      type="button"
                      style={{
                        border: "none !important",
                      }}
                      className="flex items-center justify-center gap-2 w-[20rem] h-12 bg-white text-black rounded-full border border-gray-300 shadow-sm hover:bg-gray-100 transition duration-300"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <FcGoogle className="text-2xl" />
                      Sign in with Google
                    </button>
                  )}
                />
              ) : (
                <>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 w-[20rem] h-12 bg-white text-black rounded-full border border-gray-300 shadow-sm hover:bg-gray-100 transition duration-300"
                  >
                    Signed in as {user.name}
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-[20rem] h-12 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 transition duration-300"
                  >
                    Logout
                  </button>
                </>
              )}
            </GoogleOAuthProvider>
            <button className="w-[20rem] cursor-pointer gap-2 h-12 items-center justify-center flex rounded-full bg-white text-black">
              <FaApple />
              Sign up with Apple
            </button>
          </div>
          <span className="items-center justify-center flex">or</span>
          <div className="w-[18rem]">
            <Link to="/signup">
              <button
                className="w-[20rem] h-12 flex items-center cursor-pointer justify-center rounded-full bg-[#1d9bf0] text-white"
                onClick={() => handleCraModalUpdate}
              >
                Create Account
              </button>
            </Link>
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
          <Link to="/login">
            <button className="text-[#1d9bf0] font-bold text-lg gap-2 border-[#536471] border items-center justify-center flex w-[20rem] h-12 rounded-full bg-black">
              <IoLockClosedOutline className="text-gray-500" />
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AuthSection;
