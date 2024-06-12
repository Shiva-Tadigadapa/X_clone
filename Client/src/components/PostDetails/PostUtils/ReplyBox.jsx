import React from "react";
import { useParams } from "react-router";
import { useMainDashContext } from "../../../Context/AppContext";
import { FaRegComment, FaRetweet } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { IoStatsChartSharp } from "react-icons/io5";
import { FiShare } from "react-icons/fi";
import { PiImageSquare } from "react-icons/pi";
import { MdOutlineGifBox } from "react-icons/md";
import { BsEmojiSmile } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import Comments from "../Comments";
import { useState } from "react";
import axios from "axios";
import { URL } from "../../../../Link";
import ImageKit from "imagekit";

const ReplyBox = ({ post }) => {
  const { handle, postId } = useParams();
  const { authUser } = useMainDashContext();
  const {
    HiddenDatah,
    setHiddenDatah,
    setSideSec,
    SideSec,
    setPostRender,
    PostRender,
  } = useMainDashContext();
  const [rerender, setRerender] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const imagekit = new ImageKit({
    publicKey: "public_u7kxH7LgunPNp3hdLZv7edHsbBI=",
    privateKey: "private_8CshqjFmGQTjPw/kXsyOixM5ctM=",
    urlEndpoint: "https://ik.imagekit.io/7da6fpjdo/coverImg",
    authenticationEndpoint: "http://localhost:3000/imagekit-auth",
  });

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const uploadResponse = await imagekit.upload({
        file,
        fileName: file.name,
      });

      console.log("Upload Response:", uploadResponse);

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

      console.log("Post Data:", postData);

      await axios.post(`${URL}/post/comment/${postId}/${handle}`, postData);

      setContent("");
      setImages([]);
      setRerender(!rerender);
      setPostRender(!PostRender);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="text-gray-500 flex justify-around text-xl -ml-4 w-full">
        {/* <Link to="  "> */}
        <button
          className="flex gap-2 items-center"
          onClick={() => {
            setComposeModal(!composeModal);
          }}
        >
          <FaRegComment />
          <p className="text-[16px]">656</p>
        </button>
        {/* </Link> */}
        <button className="flex gap-2 items-center">
          <FaRetweet />
          <p className="text-[16px]">10</p>
        </button>
        <button className="flex gap-2 items-center">
          <FiHeart />
          <p className="text-[16px]">566</p>
        </button>
        <button className="flex gap-2 items-center">
          <IoStatsChartSharp />
          <p className="text-[16px]">10</p>
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
                className="bg-[#1d9bf0]  h-10 w-20 rounded-full text-lg items-center flex justify-center text-white font-semibold"
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
    </>
  );
};

export default ReplyBox;
