import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./components/Auth/SignUp";
import SignIn from "./components/Auth/SignIn";
import { useMainDashContext } from "./Context/AppContext";
import Home from "./components/Home/Home";
 import NewPost from "./components/Home/Components/FeedUtils/NewPost";
import PostPage from "./components/PostDetails/PostPage";
import { URL } from "../Link";
import { Toaster, toast } from 'sonner'
function App() {
  const { isDarkMode } = useMainDashContext();
  const [CraModal, setCraModal] = useState(true);
  const handleCraModalUpdate = () => {
    setCraModal(!CraModal); // Set the modal to false to close it
  };
  const [loginModal, setLoginModal] = useState(true);
  const handleLoginModalUpdate = () => {
    setLoginModal(!loginModal); // Set the modal to false to close it
  };
  const [count, setCount] = useState(0);

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        const response = await fetch(`${URL}/wake-up`);
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (count < 5) {
      wakeUpServer();
      setCount(count + 1);
    }
  }, [count]);

  return (
    <>
      <div className={`${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignIn CraModal={CraModal} type={"signup"} handleCraModalUpdate={handleCraModalUpdate}  />} />
          <Route path="/login" element={<SignIn CraModal={loginModal} type={"login"} handleCraModalUpdate={handleLoginModalUpdate}/>} />
          <Route path="/home" element={<Home />} />
          <Route path="/post/new" element={<Home Section={"newPost"}/>} />
          <Route path="/profile/:username" element={<Home  Section={"profile"}/>} />
          <Route path="/:handle/post/:postId" element={<Home Section={"Post"} />} />
          <Route path="/logout" element={<SignIn />} />
          <Route path="/compose/post" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
