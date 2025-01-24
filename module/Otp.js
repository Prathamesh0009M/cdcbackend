const mongoose = require("mongoose");
const mailsender = require("../utils/mailsender");
// const otpEmailTemplate =require("../Templates/otpEmailTemplate")

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 *5*5* 60,
    }
    
});

// emailsender
async function sendverification(email, otp) {
    try {
        const emailBody = `
            <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <div style="background-color: #4CAF50; color: white; padding: 15px 20px; text-align: center; font-size: 20px;">
                        Career Development Center (CDC)
                    </div>
                    <div style="padding: 20px; text-align: left;">
                        <p style="font-size: 16px; line-height: 1.6;">Dear User,</p>
                        <p style="font-size: 16px; line-height: 1.6;">
                            We received a request to verify your email address for accessing the Career Development Center (CDC) services. 
                            Please use the following One-Time Password (OTP) to complete your verification:
                        </p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; font-size: 24px; font-weight: bold;">
                                ${otp}
                            </span>
                        </div>
                        <p style="font-size: 16px; line-height: 1.6;">
                            If you did not request this, please ignore this email. This OTP will expire in 15 minutes.
                        </p>
                        <p style="font-size: 16px; line-height: 1.6;">
                            Thank you,<br/>
                            Career Development Center (CDC) Team
                        </p>
                    </div>
                    <div style="background-color: #f1f1f1; color: #555; text-align: center; font-size: 12px; padding: 10px;">
                        © 2025 Career Development Center (CDC). All rights reserved.
                    </div>
                </div>
            </div>
        `;

        const mailResponse = await mailsender(
            email,
            "Verification Email from CDC",
            emailBody
        );

        console.log("Mail sent successfully ", mailResponse);
    } catch (e) {
        console.log("Error occurred while sending mail ", e);
        throw e;
    }
}

    
OTPSchema.pre("save", async function (next) {
    await sendverification(this.email, this.otp);
    next();
});


module.exports = mongoose.model("OTP", OTPSchema);