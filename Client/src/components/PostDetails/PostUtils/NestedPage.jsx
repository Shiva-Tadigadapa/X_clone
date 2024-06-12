import React from "react";
import { Link } from "react-router-dom";
import Comments from "../Comments";
// import renderImages from './renderImages'
import { renderImages } from "../../renderImages";
import verifipng from "../../../assets/verifi.png";

const NestedPage = ({
  post,
  firstHiddenData,
  calHeightRef,
  calHeight,
  pageNestedComments,
  isNested,
}) => {
  // const renderImages = () => {
  //     let mediaUrl;
  //     if (isNested) {
  //       mediaUrl = post.parentPostId
  //         ? post.parentPostId.mediaUrl
  //         : (firstHiddenData && firstHiddenData.mediaUrl) || [];
  //     } else {
  //       mediaUrl = post ? post.mediaUrl : [];
  //     }

  //     if (!mediaUrl || mediaUrl.length === 0) return null;

  //     if (mediaUrl.length === 1) {
  //       return (
  //         <div className="w-full">
  //           <img
  //             src={mediaUrl[0]}
  //             className="rounded-3xl w-full mt-4"
  //             alt="media"
  //           />
  //         </div>
  //       );
  //     } else if (mediaUrl.length === 2) {
  //       return (
  //         <div className="flex gap-2 w-full mt-4">
  //           {mediaUrl.map((url, index) => (
  //             <img
  //               key={index}
  //               src={url}
  //               className="rounded-3xl w-1/2 object-cover"
  //               alt="media"
  //             />
  //           ))}
  //         </div>
  //       );
  //     } else if (mediaUrl.length === 3) {
  //       return (
  //         <div className="flex gap-2 w-full mt-4">
  //           <div className="w-1/2">
  //             <img
  //               src={mediaUrl[0]}
  //               className="rounded-3xl h-full object-cover"
  //               alt="media"
  //             />
  //           </div>
  //           <div className="w-1/2 flex flex-col gap-2">
  //             <img
  //               src={mediaUrl[1]}
  //               className="rounded-3xl w-full object-cover"
  //               alt="media"
  //             />
  //             <img
  //               src={mediaUrl[2]}
  //               className="rounded-3xl w-full object-cover"
  //               alt="media"
  //             />
  //           </div>
  //         </div>
  //       );
  //     } else if (mediaUrl.length === 4) {
  //       return (
  //         <div className="grid grid-cols-2 gap-2 w-full mt-4">
  //           {mediaUrl.map((url, index) => (
  //             <img
  //               key={index}
  //               src={url}
  //               className="rounded-3xl w-full object-cover"
  //               alt="media"
  //             />
  //           ))}
  //         </div>
  //       );
  //     }
  //   };
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
      <div className="flex items-start flex-col h-full w-full justify-center">
        <div className="flex items-start gap-3  h-full">
          <div className="flex flex-col relative h-full w-full items-center gap-2">
            <>
              <img
                src={
                  firstHiddenData &&
                  firstHiddenData.author &&
                  firstHiddenData.author.profilePicture
                }
                className="h-10 z-[1] w-10 mt-2 rounded-full"
                alt="profile"
              />
              <div
                className={`bg-gray-600 mt-1 top-12 absolute w-[2px]`}
                style={{ height: `${calHeight && calHeight}px` }}
              />
            </>
          </div>

          <div className="items-start  flex-col  w-full   flex">
            <Link
              to={{
                pathname: `/profile/${
                  (post &&
                    post.parentPostId &&
                    post.parentPostId.author &&
                    post.parentPostId.author.handle) ||
                  (post && post.user && post.user.handle)
                }`,
              }}
            >
              <div className="  flex gap-2 w-72">
                <h1 className="text-lg hover:underline   font-semibold">
                  {(post &&
                    post.parentPostId &&
                    post.parentPostId.author &&
                    post.parentPostId.author.handle) ||
                    (post && post.user && post.user.handle)}
                </h1>
                <img
                  src={verifipng}
                  alt="verified"
                  className="h-6 w-6 mt-1.5"
                />
              </div>
            </Link>
            <Link
              to={`/profile/${
                (post &&
                  post.parentPostId &&
                  post.parentPostId.author &&
                  post.parentPostId.author.handle) ||
                (post && post.user && post.user.handle)
              }`}
            >
              <p className="text-gray-500 hover:underline">
                @
                {(post &&
                  post.parentPostId &&
                  post.parentPostId.author &&
                  post.parentPostId.author.handle) ||
                  (post && post.user && post.user.handle)}
              </p>
            </Link>
          </div>
          
        </div>
        <div className="cal-height pl-12" ref={calHeightRef}>
          <div className="ml-1">
            <p className="text-lg mt-2">
              {(post.parentPostId && post.parentPostId.content) ||
                (firstHiddenData && firstHiddenData.content)}
            </p>
            {renderImages(isNested, post, firstHiddenData)}
          </div>
        </div>
        {pageNestedComments &&
          pageNestedComments.map((comment) => (
            <Comments key={comment._id} post={comment} nested={1} />
          ))}
      </div>
    </>
  );
};

export default NestedPage;
