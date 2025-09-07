import React from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";

const HeroSection = () => {
  return (
    // hidden on mobile, flex on large screens
    <div className="hidden lg:flex flex-col justify-center items-center">
      {/* top hero photo */}
      <motion.div
        className="w-full p-4 mt-[80px] relative"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.img
          src={assets.hero1}
          alt="Groceries"
          className="mx-auto w-full rounded-xl object-cover h-[300px]"
          initial={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Text overlay */}
        <motion.div
          className="absolute select-none top-8 left-28 flex flex-col gap-5 text-white"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
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
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-28"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "backOut" }}
        >
          <button className="text-white cursor-pointer rounded-md px-3 py-3 text-lg font-bold bg-[#08c308]">
            Start Shopping
          </button>
        </motion.div>
      </motion.div>

      {/* bottom hero photo */}
      <motion.div
        className="flex justify-center w-full px-3 gap-5 items-center mt-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
        }}
      >
        {/* 1st Card - Fresh Fruits Banner */}
        <motion.div
          className="w-1/2 h-[250px] bg-gradient-to-r from-green-400 to-green-600 rounded-3xl relative overflow-hidden flex items-center justify-between px-6"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <div className="z-10 text-white max-w-[60%]">
            <h2 className="text-4xl font-bold leading-snug">Fresh & Juicy</h2>
            <p className="mt-2 text-lg font-light">
              Daily picked farm fruits delivered at your doorstep
            </p>
            <button className="mt-4 bg-white text-green-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-gray-100 transition">
              Order Fruits
            </button>
          </div>

          <motion.img
            src={assets.fruits}
            alt="Fresh Fruits"
            className="w-[200px] absolute -right-4 bottom-0 z-0"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
            }}
          />
        </motion.div>

        {/* 2nd Card - Vegetables Banner */}
        <motion.div
          className="w-1/2 h-[250px] bg-gradient-to-r from-[#FF9800] to-[#FF5722] rounded-3xl relative overflow-hidden flex items-center justify-between px-6"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <div className="z-10 text-white max-w-[50%]">
            <h2 className="text-4xl font-bold leading-snug">
              Farm Fresh Veggies
            </h2>
            <p className="mt-2 text-lg font-light">
              Get your greens crisp and healthy every day
            </p>
            <button className="mt-4 bg-white text-orange-600 px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-gray-100 transition">
              Shop Vegetables
            </button>
          </div>

          <motion.img
            src={assets.vegetables}
            alt="Fresh Vegetables"
            className="w-[220px] absolute -right-4 bottom-0 z-0"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
            }}
          />
        </motion.div>

        {/* 3rd Card */}
        <motion.div
          className="w-1/2 h-[250px] bg-[#FFDD00] rounded-3xl relative overflow-hidden flex items-center justify-between px-6"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <div className="z-10 text-black">
            <h1 className="text-5xl font-extrabold leading-tight drop-shadow-md">
              Flat <span className="text-[#FF3D3D]">20%</span>
            </h1>
            <h2 className="text-3xl font-bold tracking-wide">OFF</h2>
            <p className="mt-2 text-xl font-medium">On First Order</p>
            <button className="mt-4 bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:bg-[#333] transition">
              Shop Now
            </button>
          </div>

          <motion.img
            src={assets.hero3}
            alt=""
            className="w-[250px] absolute -right-2 bottom-0 z-0"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
