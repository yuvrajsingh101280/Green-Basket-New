import express from "express"
import { addAddress, getUserAddresses, setDefaultAddress } from "../controller/AddressController.js"
import protectRoute from "../middleware/protectRoute.js"
const router = express.Router()
router.get("/addresses", protectRoute, getUserAddresses)
router.post("/add-address", protectRoute, addAddress)

router.put("/set-default", protectRoute, setDefaultAddress)
export default router