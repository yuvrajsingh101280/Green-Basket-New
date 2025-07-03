import axios from "axios"

export const userData = async () => {

    const response = axios.get("http://localhost:8000/api/user/data", { withCredentials: true })
    console.log(response)
    return response.data
}