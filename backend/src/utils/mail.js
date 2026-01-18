import nodemailer from "nodemailer";

export const sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    });
};
