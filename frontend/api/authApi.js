import axios from "axios";



export const signup = async (userData) => {

    const response = await axios.post("http://localhost:8000/api/auth/register", userData, { withCredentials: true })
    return response.data

}
export const sendOtp = async () => {
    const response = await axios.post("http://localhost:8000/api/auth/generateOtp", {}, { withCredentials: true })

    return response.data
}
export const verifyOtp = async (otp) => {

    const response = await axios.post("http://localhost:8000/api/auth/verify-otp", { otp }, { withCredentials: true })
    return response.data

}


export const loginEmail = async (form) => {

    const response = await axios.post("http://localhost:8000/api/auth/login", form, { withCredentials: true })
    return response.data
}
export const loginOTP = async (phone) => {

    const response = await axios.post("http://localhost:8000/api/auth/otp-login", { phone })
    return response.data


}
export const loginViaOTP = async (phone, otp) => {

    const response = await axios.post("http://localhost:8000/api/auth/verify-login-otp", { phone, otp })
    return response.data

}
export const forgetPassword = async (phone) => {


    const response = await axios.post("http://localhost:8000/api/auth/foget-password", { phone }, { withCredentials: true })
    return response.data

}
export const resetPassword = async (otp, phone, newPassword) => {
    const response = await axios.post("http://localhost:8000/api/auth/reset-password", { otp, phone, newPassword })
    return response.data
}
export const Logout = async () => {
    const response = await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true })
    return response.data


}