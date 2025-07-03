import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { Logout } from "../../api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMenuItems, setShowMenuItems] = useState(false);
  const navigate = useNavigate();
  const searchPhrases = [
    'Search for "Kulfi"',
    'Search for "Paneer"',
    'Search for "Aloo"',
    'Search for "Chocolate"',
    'Search for "Ice Cream"',
  ];
  const myAccountMenu = [
    { name: "Profile", icon: assets.profile },
    { name: "My Orders", icon: assets.order_icon },
    { name: "Wishlist", icon: assets.wishlist_icon },
    { name: "Setting", icon: assets.setting },
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const { user, logoutUser } = useContext(AppContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % searchPhrases.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const logout = async () => {
    try {
      const res = await Logout();
      logoutUser();
      toast.success(res?.message || "Logged out successfully");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white h-[70px] w-[95%] mx-auto mt-6 rounded-lg shadow-md flex items-center p-4 justify-evenly">
        {/* logo */}
        <div className="border-r-1 border-gray-300 pr-1 cursor-pointer">
          <img src={assets.logo1} alt="" className="w-30" />
        </div>

        {/* select location */}
        <div className="flex gap-2 justify-center items-center ml-5 cursor-pointer">
          <h2 className="text-lg font-bold">Select Location</h2>
          <img src={assets.down_arrow} alt="" />
        </div>

        {/* search bar */}
        <div className="flex gap-2 justify-center items-center ml-5">
          <div className="h-12 w-2xl bg-[#D2F5D2] flex items-center pl-4 rounded-2xl gap-20 min-w-[300px] cursor-text">
            <img
              src={assets.search_icon}
              alt="search icon"
              className="w-8 cursor-auto"
            />
            <div className="h-full relative overflow-hidden flex items-center min-w-[200px]">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={phraseIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl text-[#6A6767] absolute"
                >
                  {searchPhrases[phraseIndex]}
                </motion.h2>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* profile */}
        <div className="ml-7 relative group">
          {user ? (
            <div
              onClick={() => setShowMenuItems((prev) => !prev)}
              className="flex gap-2 justify-center items-center cursor-pointer"
            >
              <h1 className="text-lg font-semibold">My Account</h1>
              <img src={assets.down_arrow} alt="" />
            </div>
          ) : (
            <div className="cursor-pointer flex flex-col items-center">
              <img
                src={assets.Profile}
                alt=""
                className="w-8 h-8 group-hover:opacity-80 transition"
              />
            </div>
          )}

          {/* My Account Menu */}
          {showMenuItems && user && (
            <div className="absolute right-0 top-[100%] mt-2 w-48 bg-white shadow-lg rounded-lg p-2 z-20 items-center">
              {myAccountMenu.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                >
                  <img src={item.icon} alt="" className="w-5 h-5" />
                  <span className="text-md">{item.name}</span>
                </div>
              ))}
              <div
                onClick={logout}
                className="mt-6 bg-[#FF3E3E] px-4 py-2 flex justify-center rounded-4xl cursor-pointer"
              >
                <h1 className="text-lg font-bold text-white">Logout</h1>
              </div>
            </div>
          )}

          {/* Login/Signup Menu on Hover */}
          {!user && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white shadow-xl rounded-lg py-2 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <div
                onClick={() => navigate("/signup")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 font-medium text-center rounded-md"
              >
                Signup
              </div>
              <div
                onClick={() => navigate("/login")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 font-medium text-center rounded-md"
              >
                Login
              </div>
            </div>
          )}
        </div>

        {/* notification */}
        <div>
          <img src={assets.bell} alt="" className="w-7 h-7" />
        </div>

        {/* cart */}
        <div className="ml-7">
          <div
            className={`flex items-center justify-center w-16 h-14 rounded-xl bg-[#D2F5D2] transition-opacity ${
              !user ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <img
              src={assets.cart}
              alt=""
              className={`w-7 h-7 ${
                !user ? "cursor-not-allowed" : "cursor-pointer"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
