import React, { createContext, useContext, useState ,useEffect} from "react";

const MainDashContext = createContext();

export const MainDashProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState("true");
  const [authUser, setAuthUser] = useState(() => {
    // Initialize user state from local storage if available
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

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

  // const [managetab, setManagetab] = useState("overview");

  return (
    <MainDashContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        authUser,
        setAuthUser,
        CreateAccount,
        setCreateAccount,
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
