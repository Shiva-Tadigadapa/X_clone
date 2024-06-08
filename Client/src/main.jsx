import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { MainDashProvider } from "./Context/AppContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MainDashProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MainDashProvider>
  </React.StrictMode>
);
