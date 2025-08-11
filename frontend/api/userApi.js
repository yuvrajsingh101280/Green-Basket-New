
import axionIntance from "./axios"

export const userData = async () => {

    const response = await axionIntance.get("/api/user/data")
    console.log(response)
    return response.data
}