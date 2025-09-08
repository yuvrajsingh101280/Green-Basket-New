import React from "react";
import { assets } from "../../assets/assets"; // PlayStore & AppStore badges + illustration

const DownloadAppSection = () => {
  return (
    <section className="hidden lg:block px-6 py-16 bg-[#2a6d1b] rounded-3xl relative overflow-hidden mb-20">
      {/* Decorative Background Shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#5c9c3c] opacity-30 rounded-full -translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#39841e] opacity-30 rounded-full translate-x-20 translate-y-20"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Get Groceries Delivered Fast
          </h2>
          <p className="text-white text-lg mb-6">
            Download our app and shop fresh groceries anytime, anywhere. Enjoy
            exclusive deals, flash sales, and easy checkout.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <a href="#" className="transform hover:scale-105 transition">
              <img
                src={assets.playstore} // Play Store badge
                alt="Download on Play Store"
                className="h-20"
              />
            </a>
            <a href="#" className="transform hover:scale-105 transition">
              <img
                src={assets.appstore} // App Store badge
                alt="Download on App Store"
                className="h-14 "
              />
            </a>
          </div>
        </div>

        {/* App Illustration */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            src={assets.appIllustration} // Vector illustration for app
            alt="App Illustration"
            className="h-80 lg:h-96"
          />
        </div>
      </div>
    </section>
  );
};

export default DownloadAppSection;
