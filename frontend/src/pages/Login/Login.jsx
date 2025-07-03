import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

import { loginEmail, loginOTP, loginViaOTP } from "../../../api/authApi";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [loginWithPhone, setLoginWithPhone] = useState(false);
  const [loginWithEmail, setLoginWithEmail] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { loginUser } = useContext(AppContext);

  const LoginViaPhone = () => {
    setLoginWithPhone(true);
  };

  const LoginViaEmail = () => {
    setLoginWithEmail(true);
  };

  const handleBack = () => {
    setLoginWithEmail(false);
    setLoginWithPhone(false);
  };

  const handleOTP = async (e) => {
    e.preventDefault();

    if (!phone || phone.length < 10) {
      toast.error("Enter a valid phone number");
      return;
    }
    try {
      toast.loading("sending OTP....");
      const res = await loginOTP(phone);
      toast.dismiss();
      toast.success(res?.message || "OTP sent successfully");
      setOtpSent(true);
      setResendAvailable(false);
      setCountdown(15);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setResendAvailable(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
      console.log(error);
    }
  };
  const handleLoginWithPhone = async (e) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please Provide OTP");
      return;
    }

    try {
      toast.loading("Login..");
      const res = await loginViaOTP(phone, otp);
      toast.dismiss();
      toast.success(res?.message || "Login Successfull");
      loginUser(res.user);
      navigate("/");
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    const { email, password } = form;
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }
    try {
      toast.loading("Logging in...");
      const res = await loginEmail(form);
      toast.dismiss();
      toast.success(res?.message || "Login successful");
      loginUser(res.user);
      navigate("/");
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Login failed");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-start w-full h-screen bg-[#D2F5D2] md:flex-row flex-col">
      {/* Left column */}
      <div className="w-1/2 md:flex hidden bg-[#5BE45B] justify-center items-center relative h-full">
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
          <img src={assets.deliveryboy} alt="delivery boy" />
        </motion.div>
      </div>

      {/* Right column */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        <div className="flex flex-col justify-center">
          {/* Heading */}
          <div className="flex flex-col items-center gap-1 md:py-2 px-2 mb-3">
            <h1 className="text-[50px] opacity-[56%] font-bold">Login</h1>
            <p className="md:text-[24px] font-light text-md text-gray-800 tracking-widest">
              “Good to see you again”
            </p>
          </div>

          {/* Choose Login */}
          {!loginWithEmail && !loginWithPhone && (
            <div className="flex flex-col gap-5 rounded-lg bg-white justify-center items-center p-6 md:w-lg md:h-60 w-sm h-[400px]">
              <div
                onClick={LoginViaPhone}
                className="flex gap-2 px-8 py-4 bg-[#D2F5D2] mb-2 rounded-lg justify-center items-center shadow-lg cursor-pointer"
              >
                <img src={assets.phone} alt="phone" />
                <h1 className="text-lg font-bold">Login with Phone</h1>
              </div>

              <div className="bg-gray-700 w-3/4 h-0.5" />

              <div
                onClick={LoginViaEmail}
                className="flex gap-2 px-8 py-4 bg-[#D2F5D2] mb-2 rounded-lg justify-center items-center shadow-lg cursor-pointer"
              >
                <img src={assets.mail_icon} alt="email" />
                <h1 className="font-bold text-lg">Login with Email</h1>
              </div>
            </div>
          )}

          {/* Email login form */}
          {loginWithEmail && (
            <>
              <button
                onClick={handleBack}
                className="text-sm cursor-pointer text-blue-600 underline mb-3 self-start"
              >
                ← Back
              </button>
              <motion.form
                onSubmit={handleLoginWithEmail}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="bg-white p-6 rounded-xl shadow-md max-w-md flex flex-col gap-4 w-[400px]"
              >
                <div className="flex flex-col">
                  <label htmlFor="email" className="mb-1 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="outline-none border-none py-2 px-4 bg-[#D2F5D2] rounded-md"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="mb-1 font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="outline-none border-none py-2 px-4 bg-[#D2F5D2] rounded-md"
                    placeholder="Enter your Password"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2 px-4 bg-[#5BE45B] rounded-2xl text-white cursor-pointer text-xl font-bold"
                >
                  Login
                </button>

                <div className="flex justify-between text-sm">
                  <Link to={"/forgot-password"} className="cursor-pointer">
                    Forgot password?
                  </Link>
                  <Link
                    to={"/signup"}
                    className="text-blue-500 underline cursor-pointer"
                  >
                    Signup
                  </Link>
                </div>
              </motion.form>
            </>
          )}

          {/* Phone login form */}
          {loginWithPhone && (
            <>
              <button
                onClick={handleBack}
                className="text-sm cursor-pointer text-blue-600 underline mb-3 self-start"
              >
                ← Back
              </button>
              <motion.form
                onSubmit={handleLoginWithPhone}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="bg-white p-6 rounded-xl shadow-md w-full max-w-md flex flex-col gap-5"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="number"
                    className="mb-1 font-medium text-gray-700"
                  >
                    Mobile Number
                  </label>
                  <PhoneInput
                    country={"in"}
                    value={phone}
                    onChange={(phone) => setPhone(phone)}
                    placeholder="Enter your Mobile Number"
                    inputProps={{ name: "phone", required: true }}
                    inputStyle={{
                      backgroundColor: "#D2F5D2",
                      width: "100%",
                      border: "none",
                      borderRadius: "0.375rem",
                      padding: "0.5rem 1rem",
                    }}
                    buttonStyle={{
                      backgroundColor: "#D2F5D2",
                      border: "none",
                    }}
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-3 w-full mt-2">
                  <button
                    onClick={handleOTP}
                    type="button"
                    disabled={!resendAvailable && otpSent}
                    className={`${
                      !otpSent
                        ? "bg-[#5BE45B]"
                        : resendAvailable
                        ? "bg-[#5BE45B]"
                        : "bg-[#798D79] cursor-not-allowed"
                    } text-white font-semibold py-2 px-4 rounded-lg text-base w-full md:w-fit`}
                  >
                    {!otpSent
                      ? "Send OTP"
                      : resendAvailable
                      ? "Send OTP Again"
                      : `Send OTP in ${countdown}s`}
                  </button>

                  {otpSent && (
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="bg-[#D2F5D2] py-2 px-4 rounded-lg border-none outline-none text-sm w-1/2 md:flex-1"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  className="py-2 px-1 bg-[#5BE45B] rounded-2xl text-white cursor-pointer text-xl font-bold"
                >
                  Login
                </button>

                <div className="flex justify-between text-sm">
                  <Link to={"/forgot-password"} className="cursor-pointer">
                    Forgot password?
                  </Link>
                  <Link
                    to={"/signup"}
                    className="text-blue-500 underline cursor-pointer"
                  >
                    Signup
                  </Link>
                </div>
              </motion.form>
            </>
          )}
        </div>

        {/* Animated grocery image */}
        <motion.div
          className="absolute -right-11 -bottom-3 hidden md:block"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={assets.grocery_image1}
            alt="grocery"
            className="w-54 h-54"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
