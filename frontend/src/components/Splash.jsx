import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Splash = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 6000); // 5 seconds

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#98FB98]">
        <img src={assets.logo1} alt="GreenBasket" className="w-64 mb-8" />
        <div className="w-80 h-80">
          <DotLottieReact
            src="https://lottie.host/6c68a206-d507-402a-b0e7-ad034c52dccc/60kwpw7TiV.lottie"
            autoplay
            loop
          />
        </div>
      </div>
    );
  }

  return children;
};

export default Splash;
