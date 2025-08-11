import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { Logout } from "../../api/authApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { HiOutlineMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMenuItems, setShowMenuItems] = useState(false);
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const { user, logoutUser } = useContext(AppContext);
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
      {/* Mobile Topbar */}
      <div className="md:hidden w-full bg-white shadow-md fixed top-0 left-0 z-50 flex items-center justify-between px-4 py-3">
        <img src={assets.logo1} alt="logo" className="w-24" />
        <div className="flex items-center gap-3 relative">
          {/* Cart Icon */}
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full bg-[#D2F5D2] ${
              !user ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <img src={assets.cart} alt="cart" className="w-6 h-6" />
          </div>

          {/* Profile Icon */}
          <div>
            <img
              src={user?.profilePic || assets.Profile}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover cursor-pointer"
              onClick={() => setShowAuthDropdown((prev) => !prev)}
            />
            {!user && showAuthDropdown && (
              <div className="absolute top-12 right-10 bg-white shadow-md rounded-md w-36 z-50">
                <div
                  onClick={() => {
                    navigate("/login");
                    setShowAuthDropdown(false);
                  }}
                  className="px-4 py-2 text-center text-[#32CD32] font-medium hover:bg-gray-100 cursor-pointer"
                >
                  Login
                </div>
                <div
                  onClick={() => {
                    navigate("/signup");
                    setShowAuthDropdown(false);
                  }}
                  className="px-4 py-2 text-center text-[#32CD32] font-medium hover:bg-gray-100 cursor-pointer"
                >
                  Signup
                </div>
              </div>
            )}
          </div>

          {/* Hamburger only if user is logged in */}
          {user && (
            <HiOutlineMenu
              className="text-3xl text-gray-700"
              onClick={() => {
                setShowSidebar(true);
                setShowAuthDropdown(false);
              }}
            />
          )}
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden mt-[70px] px-4 py-3">
        <div className="h-12 w-full bg-[#D2F5D2] flex items-center pl-4 pr-4 rounded-2xl gap-4 cursor-text">
          <img src={assets.search_icon} alt="search icon" className="w-6 h-6" />
          <div className="h-full relative overflow-hidden flex items-center min-w-[200px]">
            <AnimatePresence mode="wait">
              <motion.h2
                key={phraseIndex}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-base text-[#6A6767] absolute"
              >
                {searchPhrases[phraseIndex]}
              </motion.h2>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* DESKTOP NAVBAR */}
      <div className="bg-white h-[70px] w-[95%] mx-auto mt-6 rounded-lg shadow-md items-center p-4 justify-evenly hidden md:flex">
        <div className="border-r-1 border-gray-300 pr-1 cursor-pointer">
          <img src={assets.logo1} alt="logo" className="w-30" />
        </div>

        <div className="flex gap-2 justify-center items-center ml-5 cursor-pointer">
          <h2 className="text-lg font-bold">Select Location</h2>
          <img src={assets.down_arrow} alt="arrow" />
        </div>

        <div className="flex gap-2 justify-center items-center ml-5">
          <div className="h-12 w-2xl bg-[#D2F5D2] flex items-center pl-4 rounded-2xl gap-20 min-w-[300px] cursor-text">
            <img src={assets.search_icon} alt="search icon" className="w-8" />
            <div className="h-full relative overflow-hidden flex items-center min-w-[200px]">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={phraseIndex}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg text-[#6A6767] absolute"
                >
                  {searchPhrases[phraseIndex]}
                </motion.h2>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Desktop Profile */}
        <div className="ml-7 relative group">
          {user ? (
            <div
              onClick={() => setShowMenuItems((prev) => !prev)}
              className="flex gap-2 justify-center items-center cursor-pointer"
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border-2 border-gray-300 object-cover "
                />
              ) : (
                <>
                  <h1 className="text-lg font-semibold">My Account</h1>
                  <img src={assets.down_arrow} alt="" />
                </>
              )}
            </div>
          ) : (
            <div className="cursor-pointer flex flex-col items-center">
              <img
                src={assets.Profile}
                alt="Profile"
                className="w-8 h-8 group-hover:opacity-80 transition"
              />
            </div>
          )}

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
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-[#32CD32] font-medium text-center rounded-md"
              >
                Login
              </div>
            </div>
          )}
        </div>

        <div>
          <img src={assets.bell} alt="bell" className="w-7 h-7" />
        </div>

        <div className="ml-7">
          <div
            className={`flex items-center justify-center w-16 h-14 rounded-xl bg-[#D2F5D2] ${
              !user ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            <img src={assets.cart} alt="cart" className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Only if logged in) */}
      <AnimatePresence>
        {user && showSidebar && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-64 h-full bg-white z-50 shadow-lg p-5 flex flex-col gap-6 md:hidden"
          >
            <div className="flex justify-end items-center mb-4">
              <HiX
                className="text-2xl cursor-pointer"
                onClick={() => setShowSidebar(false)}
              />
            </div>

            {myAccountMenu.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <img src={item.icon} alt="" className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
            ))}

            <div
              onClick={() => {
                logout();
                setShowSidebar(false);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg text-center mt-4"
            >
              Logout
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
