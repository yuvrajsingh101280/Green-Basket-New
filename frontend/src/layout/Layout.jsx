import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <ScrollToTop />
      <div className="min-h-screen ">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
