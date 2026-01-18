import User from "../Models/user.model.js";
import { genrateOTP } from "../utils/otp.js";
import { sendOTP } from "../utils/mail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    let user = await User.findOne({ email });

    const otp = String(genrateOTP());
    const hashedOTP = await bcrypt.hash(otp, 10);
    const otpExpiration = Date.now() + 10 * 60 * 1000;

    if (!user) {
      user = new User({ email, otp: hashedOTP, otpExpiration });
    } else {
      user.otp = hashedOTP;
      user.otpExpiration = otpExpiration;
    }

    await user.save();
    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } 
    catch (err) {
      console.error("OTP ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
    
  
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpiration) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const isValid = await bcrypt.compare(String(otp), user.otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.otp = null;
    user.otpExpiration = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
};

