import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { sendOtp, verifyOtp } from "../../../api/authApi";
import useUserStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const VerifyPage = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [resendAvailable, setResendAvailable] = useState(false);
  const { setUser } = useUserStore();
  const navigate = useNavigate();
  const handleSendOTP = async () => {
    try {
      toast.loading("Sending OTP...");
      const res = await sendOtp();
      toast.dismiss();
      toast.success(res.message || "OTP sent!");

      setOtpSent(true);
      setCountdown(30);
      setResendAvailable(false);

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
      console.log(error);
      toast.dismiss();
      const errMsg =
        error.response?.data?.message || "Failed to send OTP. Try again.";
      toast.error(errMsg);
    }
  };

  const handleVerify = async () => {
    try {
      toast.loading("verifying OTP.....");
      const res = await verifyOtp(otp);
      toast.dismiss();
      toast.success(res.message || "Verified successfull");
      setUser(res.user);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error(error.message);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen  relative px-4"
      style={{
        backgroundImage: `url(${assets.verify_image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Toaster position="top-center" />
      <div
        className="border border-green-300 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)", // slight transparent white
          border: "1px solid rgba(255, 255, 255, 0.3)", // soft border
        }}
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          Verify OTP
        </h1>

        {!otpSent ? (
          <button
            onClick={handleSendOTP}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Send OTP
          </button>
        ) : (
          <>
            <div className="mt-4">
              <label className="block text-black mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-white/20 text-black placeholder-white/70 p-2 rounded-lg border border-white/30 outline-none"
              />
            </div>

            <button
              onClick={handleVerify}
              className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition"
            >
              Verify
            </button>

            <button
              onClick={handleSendOTP}
              disabled={!resendAvailable}
              className={`mt-2 w-full py-2 px-4 rounded-lg font-semibold transition ${
                resendAvailable
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {resendAvailable ? "Resend OTP" : `Resend in ${countdown}s`}
            </button>
          </>
        )}
      </div>
      <div className="logo hidden sm:block absolute top-1 left-0">
        <img src={assets.logo1} alt="" />
      </div>
    </div>
  );
};

export default VerifyPage;
