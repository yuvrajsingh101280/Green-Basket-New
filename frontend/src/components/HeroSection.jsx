import React from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const HeroSection = () => {
  return (
    <div className="flex flex-col justify-center items-center">
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
          <button className="text-white cursor-pointer rounded-md px-3 py-3 text-lg font-bold bg-[#5BE45B]">
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
        <motion.div
          className="w-1/2 h-[250px] bg-red-500 rounded-3xl"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        ></motion.div>

        <motion.div
          className="w-1/2 h-[250px] bg-red-500 rounded-3xl"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        ></motion.div>

        <motion.div
          className="w-1/2 h-[250px] bg-[#FFDD00] rounded-3xl relative overflow-hidden"
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <motion.img
            src={assets.hero3}
            alt=""
            className="w-[250px] absolute -right-2 bottom-0"
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
