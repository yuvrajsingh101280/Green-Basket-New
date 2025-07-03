import { createContext, useEffect, useState } from "react";
import React from "react";
import { userData } from "../../api/userApi";
import toast from "react-hot-toast";
import axios from "axios";
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  console.log(user);
  const signupUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };
  const verifyUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsVerified(true);
  };

  const loginUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsVerified(true);
  };
  const logoutUser = () => {
    setUser(null);
    setIsAuthenticated(false);
  };
  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/data", {
        withCredentials: true,
      });

      setUser(response.data.user);
      setIsAuthenticated(true);
      setIsVerified(true);
    } catch (error) {
      // toast.error(error.message || "unable to get user");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  const value = {
    isAuthenticated,
    user,
    loginUser,
    logoutUser,
    verifyUser,
    signupUser,
    isVerified,
    fetchUser,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
