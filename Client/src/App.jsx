import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import SignUp from "./components/Auth/SignUp";
import { useMainDashContext } from "./Context/AppContext";
import Home from "./components/Home/Home";

function App() {
  const { isDarkMode } = useMainDashContext();
  return (
    <>
      <div className={`${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}>
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
