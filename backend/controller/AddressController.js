import Address from "../model/Address.js"
import User from "../model/User.js"
import logger from "../utils/logger.js"

export const getUserAddresses = async (req, res) => {

    try {
        const userId = req.user._id
        const addresses = await Address.find({ userId })
        res.status(200).json({ success: true, addresses })


    } catch (error) {

        logger.error(`Error in getUserAddresses : ${error.message}`)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }


}
// add address
export const addAddress = async (req, res) => {


    try {
        const userId = req.user._id
        const { label, street, city, state, pincode, country, isDefault } = req.body

        const totalAddresses = await Address.countDocuments({ userId })


        const newAddress = await Address.create({ userId, label, street, city, state, pincode, country, isDefault: isDefault || totalAddresses === 0 })


        if (isDefault || totalAddresses === 0) {

            await User.findByIdAndUpdate(userId, { defaultAddressId: newAddress._id })
            await Address.updateMany({

                userId, _id: { $ne: newAddress._id },



            }, { $set: { isDefault: false } })

        }
        logger.info(`Address added for user ${userId}`)
        res.status(201).json({ success: true, address: newAddress })

    } catch (error) {
        logger.error(`Error adding address: ${error.message}`)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }


}


// set specific address as default
export const setDefaultAddress = async (req, res) => {

    try {

        const userId = req.user._id
        const { addressId } = req.body

        const address = await Address.findOne({ _id: addressId, userId })
        if (!address) {

            return res.status(400).json({ success: false, message: "Address not found" })
        }

        // Remove the default flag from all user's addresses
        await Address.updateMany({ userId }, { isDefault: false })


        // set selected address as default
        await Address.findByIdAndUpdate(addressId, { isDefault: true })
        // update the user's defualt address
        await User.findByIdAndUpdate(userId, { defaultAddressId: addressId })
        logger.info(`Default Address set for user ${userId}`)
        res.status(200).json({ success: true, message: "Default address updated" })

    } catch (error) {


        logger.error(`Error in setDefaultAddress : ${error.message}`)
        res.status(500).json({ success: false, message: "Internal Server Error" })
    }

}
