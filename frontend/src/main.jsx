import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import React from "react";

import { Toaster } from "react-hot-toast";
import AppContextProvider from "./context/AppContext.jsx";
createRoot(document.getElementById("root")).render(
  <AppContextProvider>
    <Toaster />
    <App />
  </AppContextProvider>
);
