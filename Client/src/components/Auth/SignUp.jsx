import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import IconTweet from "../../assets/Twitter-new-logo.jpg";
import { Link } from "react-router-dom";
import { useMainDashContext } from "../../Context/AppContext";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const SignUp = ({ type, CraModal2, setCraModal2, handleCraModalUpdate }) => {
  const { CreateAccount, setCreateAccount, setAuthUser } = useMainDashContext();
  const [credentials, setCredentials] = useState({ EorU: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    setCredentials((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleCreateAccountChange = (e) => {
    setCreateAccount((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    console.log(CreateAccount);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/SendMail",
        {
          username: CreateAccount.username,
          email: CreateAccount.email,
          // password: CreateAccount.password,
        }
      );
      console.log(response.data);
      setCraModal2(true);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleSubmit2 = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/verifyCra",
        {
          otp: otp,
          CreateAccount,
        }
      );
      const { token, user } = response.data;
      if (response.data.success) {
        verifyToken(token);
      } else {
        console.error("Verification failed");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const verifyToken = async (token) => {
    try {
      const tokenVerificationResponse = await axios.post(
        "http://localhost:3000/api/auth/verifyToken",
        { token }
      );
      console.log(tokenVerificationResponse.data.decoded);

      if (tokenVerificationResponse.data.success) {
        localStorage.setItem("token", token);
        localStorage.setItem(
          "user",
          JSON.stringify(tokenVerificationResponse.data.decoded)
        );
        setAuthUser(tokenVerificationResponse.data.decoded);
        navigate("/home", { replace: true });
      } else {
        console.error("Token verification failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        credentials
      );
      const { token, user } = response.data;

      if (response.data.success) {
        verifyToken(token);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const [user, setUser] = useState(null);
  useEffect(() => {
    // Check for user data in localStorage on component mount
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
        console.log("Backend authentication successful:", res.data.user);
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

  return (
    <>
      {type === "signup" && (
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
                      inputmode="numeric"
                      //add a text limit to 5 characters
                      maxlength="6"
                      min="0"
                      max="9999"
                      step="1"
                      type="text"
                      autoComplete="off"
                      placeholder="Verification Code sent to email"
                      className=" w-full h-10   border-b py-6 px-4 border-[#2f3336] bg-transparent  focus:outline-none text-white mt-4 "
                      onChange={(e) => (
                        setOtp(e.target.value), console.log(otp)
                      )}
                    />
                    <input
                      type="password"
                      name="password"
                      autoComplete="off"
                      placeholder="Create Your Password"
                      className=" w-full h-10   border-b py-6 px-4 border-[#2f3336] bg-transparent  focus:outline-none text-white mt-4 "
                      onChange={handleCreateAccountChange}
                      value={CreateAccount.password}
                    />
                  </div>
                  <button
                    className=" w-full h-12 rounded-full  bg-white/50 text-black text-lg font-bold mt-4"
                    onClick={handleSubmit2}
                  >
                    Verify & Create Account
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
                  <h1 className=" text-3xl font-semibold">
                    Create Your Account
                  </h1>
                  <div>
                    <input
                      type="text"
                      name="username"
                      autoComplete="off"
                      placeholder="Username"
                      className=" w-full h-10 rounded-lg  border py-6 px-4 border-[#2f3336] bg-transparent  focus:outline-none text-white mt-4 "
                      onChange={handleCreateAccountChange}
                      value={CreateAccount.username}
                    />
                    <input
                      type="text"
                      name="email"
                      autoComplete="off"
                      placeholder="Email"
                      className=" w-full h-10 rounded-lg  border py-6 px-4 border-[#2f3336] bg-transparent  focus:outline-none text-white mt-4 "
                      onChange={handleCreateAccountChange}
                      value={CreateAccount.email}
                    />
                  </div>
                  <button
                    className=" w-full h-12 rounded-full  bg-white/50 text-black text-lg font-bold mt-4"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Next"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {type === "login" && (
        <div className=" absolute top-0 left-0 w-full h-full bg-[#242d34] bg-opacity-60 flex items-center justify-center">
          <div className=" bg-black w-[40%]  relative h-[70%] px-4 flex  items-start justify-center  py-5 rounded-2xl">
            <Link to="/">
              <div className="  absolute left-3">
                <IoClose className="text-white text-3xl" />
              </div>
            </Link>
            <div className=" w-[75%]  relative flex flex-col  gap-2">
              <img
                src={IconTweet}
                alt="icon"
                className=" w-14 h-14  -mt-3 mx-auto "
              />
              <div className=" flex flex-col items-center gap-5">
                <h1 className=" text-3xl font-semibold">
                  Log into Your Account
                </h1>
                <div  className="flex flex-col items-center gap-2">

                <GoogleOAuthProvider clientId="199764480225-1npvvugr55pmnehika7e2dnkmpv42c01.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onFailure={handleGoogleFailure}
                    cookiePolicy="single_host_origin"
                    containerProps={{
                      className:
                        "flex items-center justify-center gap-2 w-[21rem] bg-white text-black rounded-full border border-gray-300 shadow-sm hover:bg-gray-100 transition duration-300",
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
                </GoogleOAuthProvider>

                <h1 className="  text-xl">or</h1>
                
                <div>
                  <input
                    type="text"
                    name="EorU"
                    autoComplete="off"
                    placeholder="UserName or Email"
                    className=" w-full h-10 rounded-lg  border py-6 px-4 border-[#2f3336] bg-transparent  focus:outline-none text-white  "
                    onChange={handleInputChange}
                    value={credentials.EorU}
                  />
                  <input
                    type="password"
                    name="password"
                    autoComplete="off"
                    placeholder="Enter your password"
                    className=" w-full h-10 rounded-lg  border py-6 px-4 border-[#2f3336] bg-transparent  focus:outline-none text-white  mt-4"
                    onChange={handleInputChange}
                    value={credentials.password}
                  />
                </div>
                <button
                  className=" w-full h-12 rounded-full  bg-white/50 text-black text-lg font-bold mt-4"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Logging..." : "Login"}
                </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignUp;
