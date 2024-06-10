import React, { useEffect, useState } from "react";
import Feed from "./Components/Feed";
import Happening from "./Components/Happening";
import SideSection from "./Components/SideSection";
import NewPost from "./Components/FeedUtils/NewPost";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import Profile from "../Profile/Profile";
import axios from "axios";
import PostPage from "../PostDetails/PostPage";
import { useLocation } from "react-router-dom";
import { useMainDashContext } from "../../Context/AppContext";

const Home = ({ Section }) => {
  const [posts, setPosts] = useState([]);
  const { postRender } = useMainDashContext();
  const location = useLocation();
  const hiddenData = location && location.state && location.state.hiddenData;
  console.log(hiddenData, "hiddenData");

  useEffect(() => {
    localStorage.removeItem("nestedComments");
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/post/getallposts"
        );
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
    // Remove the nestedcomments from local storage
  }, [postRender]);

  useEffect(() => {
    if (Section === "newPost") {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [Section]);

  return (
    <>
      <div
        className={` ${
          Section === "newPost" ? "bg-black" : ""
        } flex  justify-between max-w-[1400px] h-full w-full items-start  `}
      >
        <div className="h-screen border-[#2f3336]  border-r sticky top-0">
          <SideSection />
        </div>
        {Section && Section === "profile" ? (
          <Profile posts={posts} />
        ) : Section && Section === "Post" ? (
          <PostPage hiddenData={hiddenData} setSideSec2={1}/>
        ) : (
          <Feed Section={Section} posts={posts} />
        )}
        <Happening />
      </div>

      {Section && Section === "newPost" && (
        <div className="fixed top-0 rounded-3xl left-0 w-full h-full bg-[#242d34] bg-opacity-60 flex-col flex items-center justify-start">
          <div className="relative px-4 py-5 mt-20 flex flex-col w-[50%] bg-black rounded-2xl">
            <Link to="/home">
              <div className="top-3 absolute left-3">
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
