import { useEffect, useState,useRef } from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/Auth/SignIn";
import { useMainDashContext } from "./Context/AppContext";
import Home from "./components/Home/Home";
import { URL } from "../Link";
import { Toaster, toast } from 'sonner'
// import { response } from "express";
function App() {
  const { isDarkMode } = useMainDashContext();
  const [CraModal, setCraModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const handleCraModalUpdate = () => {
    setCraModal(!CraModal);
  };
  const [loginModal, setLoginModal] = useState(true);
  const handleLoginModalUpdate = () => {
    setLoginModal(!loginModal); 
  };
  const [count, setCount] = useState(0);
  const hasFetched = useRef(false);   
  useEffect(() => {
    const wakeUpServer = async() => {
      return new Promise((resolve, reject) => {
    
        fetch(`${URL}/wake-up`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            // Check content type
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              return response.json();
            } else {
              return response.text(); // Handle non-JSON response as text
            }
          })
          .then(data => {
            console.log('Fetch succeeded:', data);
            resolve(data);
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            reject(error);
          });
      });
    };

    if (!hasFetched.current) {
      hasFetched.current = true;
      const fetchPromise = wakeUpServer();
      toast.promise(fetchPromise, {
        loading: 'Waking up server...',
        success: (data) => {
          if (typeof data === 'object') {
            return `${data.message || 'Server'} is awake!`;
          } else {
            return `${data} is awake!`; 
          }
        },
        error: (error) => {
          console.log('Toast error handler error:', error);
          return `Error waking up server: ${error.message || error}`;
        },
      });
    }

  }, []);
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
