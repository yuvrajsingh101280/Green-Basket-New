
import axionIntance from "./axios"

export const userData = async () => {

    const response = await axionIntance.get("http://localhost:8000/api/user/data", { withCredentials: true })
    console.log(response)
    return response.data
}