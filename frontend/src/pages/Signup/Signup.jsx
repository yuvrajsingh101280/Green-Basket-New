import React, { useContext, useState, useEffect } from "react";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import toast from "react-hot-toast";
import { signup } from "../../../api/authApi";
import { AppContext } from "../../context/AppContext";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

// Image preload hook
const useImagePreload = (srcArray) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    srcArray.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === srcArray.length) setLoaded(true);
      };
    });
  }, [srcArray]);

  return loaded;
};

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const navigate = useNavigate();
  const { signupUser } = useContext(AppContext);

  // Preload main images before animation
  const imagesLoaded = useImagePreload([
    assets.deliveryboy,
    assets.grocery_image1,
  ]);

  const handleCreateAccont = async (e) => {
    e.preventDefault();
    const { email, name, password, phone } = form;
    let toastId;

    try {
      if (!phone || !email || !name || !password) {
        toast.error("All fields are required");
        return;
      }
      toastId = toast.loading("Creating account....");
      const res = await signup(form);
      const { user } = res;
      signupUser(user);
      toast.success(res.message);
      navigate("/verify-page");
    } catch (error) {
      toast.error(error.message || "Signup failed");
      console.log(error);
    } finally {
      if (toastId) toast.dismiss(toastId);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen bg-[#D2F5D2]">
      {/* Left column */}
      <div className="w-1/2 md:flex hidden bg-[#5BE45B] justify-center items-center relative">
        {imagesLoaded && (
          <>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 0.5 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute top-16 right-12 text-black opacity-[56%] font-extrabold text-7xl leading-snug"
            >
              <p>Get</p>
              <p>Delivery</p>
              <p>At</p>
              <p>Doorstep</p>
            </motion.div>

            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="w-[904px] h-[730px] absolute top-0 right-0 overflow-hidden"
            >
              <img
                src={assets.deliveryboy}
                alt="delivery boy"
                className="pt-0 pb-0"
                loading="eager"
              />
            </motion.div>
          </>
        )}
      </div>

      {/* Right column */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        <div className="flex flex-col items-center gap-2 py-2 px-2 mb-3 text-center">
          <h1 className="text-[44px] opacity-[56%] font-bold">Signup</h1>
          <p className="md:text-[24px] font-light text-md text-gray-800">
            “Create your account to start shopping fresh!”
          </p>
        </div>

        <motion.form
          onSubmit={handleCreateAccont}
          initial={{ y: 50, opacity: 0 }}
          animate={imagesLoaded ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="bg-white p-6 rounded-xl shadow-md flex flex-col gap-4 w-full max-w-md"
        >
          {/* Inputs */}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="outline-none border-none px-4 py-2 bg-[#D2F5D2] rounded-md"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="outline-none border-none py-2 px-4 bg-[#D2F5D2] rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium">
              Password
            </label>
            <div className="flex items-center justify-between relative">
              {" "}
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="outline-none border-none py-2 px-4 bg-[#D2F5D2] rounded-md w-full"
                placeholder="Enter your password"
                required
              />
              <div
                onClick={handleShowPassword}
                className="absolute right-5 w-2"
              >
                {" "}
                {showPassword ? <IoEye /> : <IoEyeOff />}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="number" className="mb-1 font-medium">
              Mobile Number
            </label>
            <PhoneInput
              country={"in"}
              value={form.phone}
              onChange={(phone) => setForm({ ...form, phone })}
              placeholder="Enter your Mobile Number"
              inputProps={{ name: "phone", required: true }}
              inputStyle={{
                backgroundColor: "#D2F5D2",
                width: "100%",
                border: "none",
                borderRadius: "0.375rem",
                padding: "0.5rem 1rem",
              }}
              buttonStyle={{ backgroundColor: "#D2F5D2", border: "none" }}
              required
            />
          </div>

          <button
            type="submit"
            className="py-2 px-4 bg-[#5BE45B] rounded-2xl text-white cursor-pointer text-xl font-bold"
          >
            Create Your Account
          </button>

          <div className="flex justify-between text-sm">
            <p>Already have an account?</p>
            <Link
              to={"/login"}
              className="text-blue-500 underline cursor-pointer"
            >
              Login
            </Link>
          </div>
        </motion.form>

        {/* Grocery image (lazy loaded) */}
        <motion.div
          className="absolute -right-11 -bottom-3 hidden md:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={assets.grocery_image1}
            alt=""
            className="w-54 h-54"
            loading="lazy"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
