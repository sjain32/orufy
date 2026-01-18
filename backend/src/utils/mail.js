import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER, // apikey
            pass: process.env.SMTP_PASS, // xsmtpsib-...
        },
    });

    await transporter.sendMail({
        from: '"Yota" <ravi73sam@gmail.com>', // ✅ VERIFIED BREVO SENDER
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    });
};
