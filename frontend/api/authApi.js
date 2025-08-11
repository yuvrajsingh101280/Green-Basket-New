
import axionIntance from "./axios";

export const signup = async (userData) => {
    const response = await axionIntance.post("/api/auth/register", userData);
    return response.data;
};

export const sendOtp = async () => {
    const response = await axionIntance.post("/api/auth/generateOtp", {});
    return response.data;
};

export const verifyOtp = async (otp) => {
    const response = await axionIntance.post("/api/auth/verify-otp", { otp });
    return response.data;
};

export const loginEmail = async (form) => {
    const response = await axionIntance.post("/api/auth/login", form);
    return response.data;
};

export const loginOTP = async (phone) => {
    const response = await axionIntance.post("/api/auth/otp-login", { phone });
    return response.data;
};

export const loginViaOTP = async (phone, otp) => {
    const response = await axionIntance.post("/api/auth/verify-login-otp", { phone, otp });
    return response.data;
};

export const forgetPassword = async (phone) => {
    const response = await axionIntance.post("/api/auth/foget-password", { phone });
    return response.data;
};

export const resetPassword = async (otp, phone, newPassword) => {
    const response = await axionIntance.post("/api/auth/reset-password", { otp, phone, newPassword });
    return response.data;
};

export const Logout = async () => {
    const response = await axionIntance.post("/api/auth/logout", {});
    return response.data;
};
