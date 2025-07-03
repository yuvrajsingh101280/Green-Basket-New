import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { forgetPassword, resetPassword } from "../../../api/authApi";

const Forgot_Password = () => {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleOTP = async () => {
    try {
      if (!phone || phone.length < 10) {
        toast.error("Enter a valid mobile number");
        return;
      }
      toast.loading("sending OTP...");
      const response = await forgetPassword(phone);
      toast.dismiss();
      toast.success(response.message || "OTP Sent!");
      setOtpSent(true);
      setResendAvailable(false);
      setCountdown(30);

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
      console.error(error.message);
      toast.dismiss();
      toast.error("Failed to send otp");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      toast.loading("Reseting password.....");
      const res = await resetPassword(otp, phone, newPassword);

      toast.dismiss();
      toast.success(res?.message || "Password changed successfully");
      navigate("/");
    } catch (error) {
      toast.dismiss();
      console.log(error.message);
      toast.error(error.message || "Error in changin password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F0FFF0] px-4">
      <Toaster position="top-center" />

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Reset Your Password
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your mobile number to receive OTP
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Mobile Number</label>
          <PhoneInput
            country={"in"}
            value={phone}
            onChange={setPhone}
            inputStyle={{
              width: "100%",
              backgroundColor: "#F0FFF0",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "10px",
            }}
            buttonStyle={{ backgroundColor: "#F0FFF0", border: "none" }}
          />
        </div>

        {!otpSent ? (
          <button
            onClick={handleOTP}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Send OTP
          </button>
        ) : (
          <>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full bg-[#F0FFF0] p-2 rounded-lg border border-gray-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter New Password"
                  className="w-full bg-[#F0FFF0] p-2 rounded-lg border border-gray-300 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Reset Password
            </button>

            <button
              onClick={handleOTP}
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

export default Forgot_Password;
