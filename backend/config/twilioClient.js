import dotenv from "dotenv"

import twilio from "twilio"
dotenv.config()
const client = twilio(process.env.TWILIO_ACCOUNT_SSID, process.env.TWILIO_AUTH_TOKEN)


// function to send otp


export const sendOTP = async (phone) => {

    return client.verify.v2.services(process.env.TWILIO_VERIFY_SID).verifications.create({

        channel: "sms",
        to: phone,
    })



}


// verify the otp


export const verifyOTP = async (phone, code) => {


    return client.verify.v2.services(process.env.TWILIO_VERIFY_SID).verificationChecks.create({ to: phone, code })


}


export const sendOrderConfirmationSMS = async ({ phone, orderId, amount, deliveryDate, trackingUrl }) => {
    const message = `Your order ${orderId} of ${amount} has been placed successfully\n Expected delivery : ${deliveryDate} in 15-20 minutes\n Track here : ${trackingUrl}`
    try {
        const res = await client.messages.create({

            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
            body: message


        })
        return res
    } catch (error) {
        console.log("Error in seding SMS ", error.message)
        return null
    }

}
// send sms
export const sendSMS = async (to, message) => {

    try {

        await client.messages.create({



            body: message, to: to, from: process.env.TWILIO_PHONE_NUMBER

        })
        console.log("SMS sent successfully")


    } catch (error) {
        console.log("Error sending SMs", error)
    }



}