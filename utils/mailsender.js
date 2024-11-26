const nodemailer = require("nodemailer");

const mailsender = async (email, title, body) => {
    try {
        // Normalize email input to handle both string and array
        const recipientEmails = Array.isArray(email) ? email.join(",") : email;

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        console.log("Recipient emails:", recipientEmails);

        let info = await transporter.sendMail({
            from: 'pratham <your_email@example.com>', // Replace with your email
            to: recipientEmails, // Send to normalized list
            subject: title,
            html: body,
        });

        console.log("Email sent successfully:", info);
        return info;
    } catch (e) {
        console.error("Error sending email:", e.message);
        throw e;
    }
};

module.exports = mailsender;
