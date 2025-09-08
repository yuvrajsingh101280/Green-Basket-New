import React from "react";
import { assets } from "../assets/assets";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-t rounded-t-4xl from-[#f5fff7] to-[#e6f7eb] pt-12 pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-10">
        {/* Logo & Description */}
        <div className="flex flex-col gap-4 md:w-1/3">
          <img
            src={assets.logo1}
            alt="Grocery App Logo"
            className="w-36 md:w-44 object-contain"
          />
          <p className="text-gray-800 text-sm md:text-base">
            Fresh groceries delivered to your doorstep. Healthy, eco-friendly,
            and always on time.
          </p>
          <div className="flex gap-4 mt-3 text-gray-700">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                aria-label="Social"
                className="hover:text-[#c99443] transition-colors duration-300"
              >
                <Icon size={22} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-2 md:w-1/4">
          <h3 className="font-semibold text-gray-800 text-lg mb-2">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-1 text-gray-700 text-sm">
            {["Home", "Shop", "Categories", "About Us", "Contact"].map(
              (link, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="hover:text-[#c99443] transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* App Download */}
        <div className="flex flex-col gap-3 md:w-1/4">
          <h3 className="font-semibold text-lg mb-2 text-gray-800">
            Download Our App
          </h3>
          <div className="flex items-center gap-3">
            <a href="#">
              <img
                src={assets.playstore}
                alt="Play Store"
                className="w-32 md:w-36 object-contain hover:scale-105 transition-transform shadow-lg rounded-xl"
              />
            </a>
            <a href="#">
              <img
                src={assets.appstore}
                alt="App Store"
                className="w-32 md:w-36 object-contain hover:scale-105 transition-transform shadow-lg rounded-xl"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="mt-12 border-t border-gray-300/40 pt-8 max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-5">
        <p className="text-gray-700 text-sm md:text-base">
          Subscribe to our newsletter for fresh updates and offers
        </p>
        <div className="flex w-full md:w-auto">
          <input
            type="email"
            placeholder="Your email"
            className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none text-gray-900 placeholder-gray-500 transition"
          />
          <button className="bg-[#2a6d1b] hover:bg-[#338421] text-white px-6 py-3 rounded-r-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
            Subscribe
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-gray-500 text-xs md:text-sm">
        &copy; {new Date().getFullYear()} Green Basket. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
