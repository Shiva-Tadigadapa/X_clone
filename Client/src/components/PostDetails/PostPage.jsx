import React, { useRef, useState, useEffect } from "react";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import { FiHeart, FiShare } from "react-icons/fi";
import { IoStatsChartSharp, IoClose } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useMainDashContext } from "../../Context/AppContext";
import ImageKit from "imagekit";
import { BsEmojiSmile } from "react-icons/bs";
import { MdOutlineGifBox } from "react-icons/md";
import Comments from "./Comments";
import { URL } from "../../../Link";
import ComposePost from "../ComposePost";
import NestedPage from "./PostUtils/NestedPage";
import { renderImages } from "../renderImages";
import PageHeader from "./PostUtils/PageHeader";
import MainPostPage from "./PostUtils/MainPostPage";
import { IoClose as IoCloseOutline } from "react-icons/io5";
import { PiImageSquare } from "react-icons/pi";
import heartPng from "../../assets/heart.png";

const PostPage = ({ setSideSec2 }) => {
  const { handle, postId } = useParams();
  const {
    HiddenDatah,
    setHiddenDatah,
    setSideSec,
    SideSec,
    authUser,
    nestedComments,
    setNestedComments,
  } = useMainDashContext();
  const [post, setPost] = useState({});
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isNested, setIsNested] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [pageNestedComments, setPageNestedComments] = useState({});
  const [hiddenData, setHiddenData] = useState(() => {
    const storedData = localStorage.getItem("hiddenData");
    return storedData ? JSON.parse(storedData) : {};
  });
  const [composeModal, setComposeModal] = useState(false);
  const [likeCount, setLikeCount] = useState(
    post.likes ? post.likes.length : "0"
  );
  const [retweet, setRetweet] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const imagekit = new ImageKit({
    publicKey: "public_u7kxH7LgunPNp3hdLZv7edHsbBI=",
    privateKey: "private_8CshqjFmGQTjPw/kXsyOixM5ctM=",
    urlEndpoint: "https://ik.imagekit.io/7da6fpjdo/coverImg",
    authenticationEndpoint: "http://localhost:3000/imagekit-auth",
  });

  setSideSec(setSideSec2);

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};
    setIsLiked(likedPosts[postId] || false);
  }, [postId]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const uploadResponse = await imagekit.upload({
        file,
        fileName: file.name,
      });

      const imageUrl = uploadResponse.url;
      setImages((prevImages) => [...prevImages, { url: imageUrl }]);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    setLoading(true);
    try {
      const postData = {
        content,
        images,
        userId: authUser.userId,
        parentCommentId: postId,
      };

      await axios.post(`${URL}/post/comment/${postId}/${handle}`, postData);

      setContent("");
      setImages([]);
      setRerender(!rerender);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${URL}/post/${postId}/${handle}`);
        setIsNested(response.data.isNested);
        setPost(response.data.post);

        setHiddenData((prevHiddenData) => {
          const updatedHiddenData = {
            ...prevHiddenData,
            [postId]: response.data.post,
          };
          localStorage.setItem("hiddenData", JSON.stringify(updatedHiddenData));
          return updatedHiddenData;
        });
        setNestedComments((prevNestedComments) => {
          const uniqueIds = new Set(prevNestedComments);

          if (!uniqueIds.has(response.data.post._id)) {
            const updatedNestedComments = [
              ...prevNestedComments,
              response.data.post._id,
            ];
            localStorage.setItem(
              "nestedComments",
              JSON.stringify(updatedNestedComments)
            );

            return updatedNestedComments;
          } else {
            return prevNestedComments;
          }
        });
        setLikeCount(response.data.post.likes.length);
        const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};
        setIsLiked(likedPosts[postId] || false);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchPost();
    // useEffect(() => {
      const viewIncreament = async () => {
        try {
          await axios.post(`${URL}/post/${postId}/view`);
        } catch (error) {
          console.error(error);
        }
      }
      viewIncreament();
      // } , []);
  }, [handle, postId, rerender]);

  const getFirstHiddenData = () => {
    if (!hiddenData || typeof hiddenData !== "object") return null;
    const keys = Object.keys(hiddenData);
    if (keys.length > 0) {
      const firstKey = keys[0];
      return hiddenData[firstKey];
    }
    return null;
  };

  const firstHiddenData = getFirstHiddenData();

  const [calHeight, setCalHeight] = useState(0);
  const calHeightRef = useRef(null);
  useEffect(() => {
    if (calHeightRef.current) {
      setCalHeight(calHeightRef.current.clientHeight + 12);
    }
  }, [post]);

  useEffect(() => {
    const sendNestedCommentsToBackend = async () => {
      try {
        const response = await axios.get(`${URL}/post/nestedComment`, {
          params: {
            nestedComments: JSON.stringify(nestedComments),
          },
        });
        setPageNestedComments(response.data.nestedComments);
      } catch (error) {
        console.error("Error sending nested comments to backend:", error);
      }
    };

    sendNestedCommentsToBackend();
  }, [nestedComments]);

  const handleLike = async () => {
    try {
      const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || {};
      if (isLiked) {
        setLikeCount(likeCount - 1);
        delete likedPosts[postId];
      } else {
        setLikeCount(likeCount + 1);
        likedPosts[postId] = true;
      }
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
      setIsLiked(!isLiked);
      await axios.post(`${URL}/post/${postId}/like`, {
        userId: authUser.userId,
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col border-b ${
          post &&
          post.mediaUrl &&
          post.mediaUrl.length &&
          hiddenData.mediaUrl &&
          hiddenData.mediaUrl === 0
            ? "w-full"
            : "w-full"
        } h-full w-full border-[#2f3336] items-start gap-3 px-6`}
      >
        <PageHeader />
        {isNested && isNested ? (
          <NestedPage
            post={post}
            firstHiddenData={firstHiddenData}
            calHeightRef={calHeightRef}
            calHeight={calHeight}
            pageNestedComments={pageNestedComments}
            isNested={isNested}
          />
        ) : (
          <>
            <MainPostPage
              post={post}
              firstHiddenData={firstHiddenData}
              calHeightRef={calHeightRef}
              calHeight={calHeight}
              pageNestedComments={pageNestedComments}
              isNested={isNested}
            />
          </>
        )}

        <div className="w-full px-4 h-[1px] bg-gray-600" />
        <div className="text-gray-500 flex justify-around text-xl -ml-4 w-full">
          <button
            className="flex gap-2 items-center"
            onClick={() => {
              setComposeModal(!composeModal);
            }}
          >
            <FaRegComment />
            <p className="text-[16px]">656</p>
          </button>
          <button className="flex gap-2 items-center  "
           style={{ color: retweet ? "#005d96" : "inherit" }}
            onClick={async () => {
              await axios.post(`${URL}/post/${postId}/retweet`, {
                userId: authUser.userId,
              });
              setRerender(!rerender);
              setRetweet(true);
            }}
          >
            <FaRetweet 
            />
            <p className="text-[16px]">{post && post.retweets}</p>
          </button>
          <button className="flex gap-2 items-center" onClick={handleLike}>
            {isLiked ? (
              <div className="flex  items-center gap-2">
                <img src={heartPng} className="h-6 w-6" />
                <p className="text-[16px]">{likeCount}</p>
              </div>
            ) : (
              <FiHeart
                style={{ color: isLiked ? "red" : "inherit" }}
                onClick={handleLike}
              />
            )}
          </button>
          <button className="flex gap-2 items-center">
            <IoStatsChartSharp />
            <p className="text-[16px]">{post && post.views}</p>
          </button>
          <div className="flex gap-4 justify-between">
            <button className="flex gap-2 items-center">
              <FiShare className="text-xl" />
            </button>
          </div>
        </div>
        <div className="w-full h-[1px] bg-gray-600" />
        <div className="rounded-2xl items-start justify-start max-h-[30rem] flex px-2 py-5 w-full gap-4 overflow-y-auto">
          <img
            src={authUser?.picture}
            className="h-10 w-10 rounded-full"
            alt="profile"
          />
          <div className="w-full">
            <textarea
              type="text"
              placeholder="What's happening?"
              className="w-full h-14 text-2xl border-none active:outline-none outline-none focus:border-none bg-transparent text-white"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {images.length > 0 && (
              <div className="mt-4 flex overflow-x-auto gap-2">
                {images.map((image, index) => (
                  <div key={index} className="flex relative">
                    <IoClose
                      className="text-white text-2xl absolute right-0 top-0 cursor-pointer"
                      onClick={() =>
                        setImages((prevImages) =>
                          prevImages.filter((_, i) => i !== index)
                        )
                      }
                    />
                    <img
                      src={image.url}
                      className="h-56 w-56 object-cover rounded-md"
                      alt="uploaded"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="w-full mt-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <PiImageSquare className="text-[22px] font-bold text-[#1d9bf0]" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  <button className="flex items-center">
                    <MdOutlineGifBox className="text-[22px] font-bold text-[#1d9bf0]" />
                  </button>
                  <button className="flex items-center">
                    <BsEmojiSmile className="text-[20px] font-bold text-[#1d9bf0]" />
                  </button>
                </div>

                <button
                  className="bg-[#1d9bf0] h-10 w-20 rounded-full text-lg items-center flex justify-center text-white font-semibold"
                  onClick={handlePost}
                  disabled={loading || !content}
                >
                  {loading ? "Posting..." : "Reply"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-[1px] bg-gray-600" />
        <div className="w-full">
          {post.timeline &&
            post.timeline
              .slice(post && post.nestedComment)
              .map((comment) => <Comments key={comment._id} post={comment} />)}
        </div>
      </div>

      {composeModal && (
        <div className="fixed top-0 z-[1] rounded-3xl left-0 w-full h-full bg-[#242d34] bg-opacity-60 flex-col flex items-center justify-start">
          <div className="relative items-start justify-start w-[50%] py-5 mt-20 flex flex-col bg-black rounded-2xl">
            <div
              onClick={() => {
                setComposeModal(false);
                setRerender(!rerender);
              }}
              className="cursor-pointer"
            >
              <div className="top-3 z-[1] absolute left-3">
                <IoClose className="text-white text-2xl" />
              </div>
            </div>
            <ComposePost post={post} />
          </div>
        </div>
      )}
    </>
  );
};

export default PostPage;
