import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useMainDashContext } from "../../../Context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { IoLockClosedOutline } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { URL } from "../../../../Link";
import {  toast } from 'sonner'

const AuthSection = ({ CraModal2, setCraModal, handleCraModalUpdate }) => {
  const { authUser, setAuthUser } = useMainDashContext();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setAuthUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    // Setup token refresh
    const setupRefreshToken = () => {
      const decodedToken = jwtDecode(storedToken);
      const expiresIn = decodedToken.exp * 1000 - Date.now() - 60000; // 1 minute before expiry
      setTimeout(refreshAuthToken, expiresIn);
    };

    if (storedToken) {
      setupRefreshToken();
    }
  }, []);

  const handleGoogleSuccess = async (response) => {
    const userObject = jwtDecode(response.credential);

    try {
      const res = await axios.post(`${URL}/api/auth/google`, {
        token: response.credential,
      });

      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setUser(res.data.user);
        setAuthUser(res.data.user);
        console.log("User:", res.data.user);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        navigate("/home", { replace: true });
        toast.success("Login Successful to "+ res.data.user.name)

        // Setup token refresh
        setupRefreshToken(res.data.token);
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
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("likedPosts");
    toast.success("Logout Successful")
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const refreshAuthToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("No refresh token found");

      const response = await axios.post(`${URL}/api/auth/refresh-token`, {
        refreshToken,
      });

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Setup token refresh
        setupRefreshToken(token);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  const setupRefreshToken = (token) => {
    const decodedToken = jwtDecode(token);
    const expiresIn = decodedToken.exp * 1000 - Date.now() - 60000; // 1 minute before expiry
    setTimeout(refreshAuthToken, expiresIn);
  };

  return (
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
            By signing up, you agree to the Terms of Service and Privacy Policy,
            including Cookie Use.
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
  );
};

export default AuthSection;
