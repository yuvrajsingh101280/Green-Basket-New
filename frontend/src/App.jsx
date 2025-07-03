import React, { useEffect, useState } from "react";

import { router } from "../router";
import Splash from "./components/Splash";
import { RouterProvider } from "react-router-dom";
import AppContextProvider from "./context/AppContext";
const App = () => {
  const location = window.location.pathname;
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (location === "/") {
      const timeout = setTimeout(() => {
        setShowSplash(false);
      }, 6000); // 6 seconds

      return () => clearTimeout(timeout);
    } else {
      setShowSplash(false);
    }
  }, [location]);
  return (
    <AppContextProvider>
      {/* {showSplash ? <Splash /> : <RouterProvider router={router} />} */}
      <RouterProvider router={router} />
    </AppContextProvider>
  );
};

export default App;
