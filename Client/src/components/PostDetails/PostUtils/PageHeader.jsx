import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const YourComponent = () => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-4 w-full justify-start sticky top-0 bg-black/70 backdrop-blur-md items-center gap-8 flex">
      <button
        onClick={() => {
          // Remove items from local storage
          localStorage.removeItem("nestedComments");
          localStorage.removeItem("hiddenData");
          // Navigate to the previous page
          navigate("/home");
        }}
      >
        <FaArrowLeft className="text-xl" />
      </button>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold">Post</h1>
      </div>
    </div>
  );
};

export default YourComponent;
