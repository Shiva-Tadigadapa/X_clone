import React from "react";
import { Link } from "react-router-dom";
import { renderImages } from "../../renderImages";
import verifipng from "../../../assets/verifi.png";

const MainPostPage = ({
  post,
  firstHiddenData,
  calHeightRef,
  calHeight,
  pageNestedComments,
  isNested,
}) => {
  const renderDate = (date) => {
    const currentDate = new Date();
    const postDate = new Date(date);
    const diff = currentDate - postDate;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };
  return (
    <>
      <div className="flex w-full items-start flex-col justify-center">
        <div className="flex items-start w-full gap-3">
          <img
            src={post && post.author && post.author.profilePicture}
            className="h-10 w-10 mt-2 rounded-full"
            alt="profile"
          />
          <div className="items-center  justify-between w-full    flex">
            <div className=" flex gap-2 w-full">
              <div>
                <Link to={`/profile/${post.author && post.author.handle}`}>
                  <h1 className="text-lg font-semibold hover:underline">
                    {post.author && post.author.handle}
                  </h1>
                </Link>
                <Link to={`/profile/${post.author && post.author.handle}`}>
                  <p className="text-gray-500 hover:underline">
                    @{post.author && post.author.handle}
                  </p>
                </Link>
              </div>
                <img src={verifipng} alt="verified" className="h-6 w-6 mt-1.5" />
            </div>
            <p className=" text-sm  text-gray-400 -ml-20">
              {renderDate(post.createdAt)} Ago
            </p>
          </div>
        </div>
        <div className="  ">
          <div className="ml-1 ">
            <p className="text-lg mt-2 ">{post && post.content}</p>
            {renderImages(isNested, post, firstHiddenData)}
          </div>
        </div>
      </div>
      <h1 className="text-[17px] tracking-wider text-gray-500 font-medium">
        5:40 PM . Jun 9, 2024 . 1.1M Views
      </h1>
    </>
  );
};

export default MainPostPage;
