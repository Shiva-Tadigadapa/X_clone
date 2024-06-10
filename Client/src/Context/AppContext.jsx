import React, { createContext, useContext, useState, useEffect } from "react";

const MainDashContext = createContext();

export const MainDashProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState("true");
  const [authUser, setAuthUser] = useState(() => {
    // Initialize user state from local storage if available
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [nestedComments, setNestedComments] = useState(() => {
    // Initialize nestedComments state from local storage if available
    const storedComments = localStorage.getItem("nestedComments");
    return storedComments ? JSON.parse(storedComments) : [];
  });

  const [HiddenDatah,setHiddenDatah] = useState(null);
  //create an state which takes username and email and password
  const [CreateAccount, setCreateAccount] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    // Save user data to local storage whenever it changes
    localStorage.setItem("user", JSON.stringify(authUser));
  }, [authUser]);

  useEffect(() => {
    // Save nestedComments data to local storage whenever it changes
    localStorage.setItem("nestedComments", JSON.stringify(nestedComments));
  }, [nestedComments]);

  useEffect(() => {
    // Save hiddenData data to local storage whenever it changes
    localStorage.setItem("hiddenData", JSON.stringify(HiddenDatah));
  }, [HiddenDatah]);

  return (
    <MainDashContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        authUser,
        setAuthUser,
        CreateAccount,
        setCreateAccount,
        nestedComments,
        setNestedComments,
        HiddenDatah,
        setHiddenDatah
      }}
    >
      {children}
    </MainDashContext.Provider>
  );
};

export const useMainDashContext = () => {
  const context = useContext(MainDashContext);
  if (!context) {
    throw new Error(
      "useMainDashContext must be used within a MainDashProvider"
    );
  }
  return context;
};
