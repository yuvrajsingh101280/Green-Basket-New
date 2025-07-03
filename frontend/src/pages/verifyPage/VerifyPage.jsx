import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { sendOtp, verifyOtp } from "../../../api/authApi";
import useUserStore from "../../store/store";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col items-center justify-center h-screen bg-[#F0FFF0] px-4">
      <Toaster position="top-center" />
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
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
              <label className="block text-gray-700 mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full bg-[#F0FFF0] p-2 rounded-lg border border-gray-300 outline-none"
              />
            </div>

            <button
              onClick={handleVerify}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition"
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
    </div>
  );
};

export default VerifyPage;
