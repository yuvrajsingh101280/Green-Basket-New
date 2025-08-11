import axios from "axios";

const API_BASE = import.meta.env.PROD
    ? "https://green-basket-new-1.onrender.com"
    : "http://localhost:8000";

const axionIntance = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // send cookies with every request
});

export default axionIntance;
