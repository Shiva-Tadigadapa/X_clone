import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./components/Auth/SignUp";
import SignIn from "./components/Auth/SignIn";
import { useMainDashContext } from "./Context/AppContext";
import Home from "./components/Home/Home";

function App() {
  const { isDarkMode } = useMainDashContext();
  const [CraModal, setCraModal] = useState(true);
  const handleCraModalUpdate = () => {
    setCraModal(!CraModal); // Set the modal to false to close it
  };

  return (
    <>
      <div className={`${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignIn CraModal={CraModal} handleCraModalUpdate={handleCraModalUpdate}  />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
