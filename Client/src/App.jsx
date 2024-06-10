import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./components/Auth/SignUp";
import SignIn from "./components/Auth/SignIn";
import { useMainDashContext } from "./Context/AppContext";
import Home from "./components/Home/Home";
 import NewPost from "./components/Home/Components/FeedUtils/NewPost";

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
        </Routes>
      </div>
    </>
  );
}

export default App;
