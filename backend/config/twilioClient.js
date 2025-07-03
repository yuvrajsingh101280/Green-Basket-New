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


