import React from "react";
import { assets } from "../assets/assets";

const HeroSection = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* top hero photo */}
      <div className="w-full p-4 mt-[80px] relative">
        <img
          src={assets.hero1}
          alt="Groceries"
          className="mx-auto w-full rounded-xl object-cover h-[300px]"
        />

        {/* Text overlay */}
        <div className="absolute select-none top-8 left-28 flex flex-col gap-5 text-white">
          <div>
            <h2 className="text-6xl font-extrabold">Groceries Delivered</h2>
            <h2 className="text-4xl font-extrabold">in Minutes</h2>
          </div>
          <div>
            <p className="text-3xl font-light">
              Fresh, fast, and at your doorstep —
            </p>
            <p className="text-2xl font-light">Start shopping now</p>
          </div>
        </div>

        <div className="absolute bottom-10  left-28 ">
          {" "}
          <button className="text-white  cursor-pointer rounded-md px-3 py-3 text-lg font-bold bg-[#5BE45B]">
            Start Shopping
          </button>
        </div>
      </div>

      {/* bottom hero photo */}
      <div className="flex justify-center w-full px-3 gap-3 items-center mt-6">
        <div className="w-1/2 h-[250px] bg-red-500 rounded-3xl "></div>
        <div className="w-1/2 h-[250px] bg-red-500 rounded-3xl"></div>{" "}
        <div className="w-1/2 h-[250px] bg-[#FFDD00] rounded-3xl relative overflow-hidden">
          <img
            src={assets.hero3}
            alt=""
            className="w-[250px] absolute -right-2 bottom-0"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
