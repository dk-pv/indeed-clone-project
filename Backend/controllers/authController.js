import User from "../models/userModel.js";
import { generateOTP } from "../utils/otpGenerator.js";
import { sendOTP } from "../config/nodemailer.js";
import { generateEmployerToken } from "../utils/token.js";
import { tempUserStorage } from "../utils/tempUserStorage.js";
import dotenv from "dotenv";
dotenv.config();

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const requestOTP = async (req, res) => {
  try {
    const { email, role } = req.body;
    const otp = generateOTP();
    tempUserStorage[email] = { otp, role };
    await sendOTP(email, otp);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const tempData = tempUserStorage[email];
    if (!tempData || tempData.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        isVerified: true,
        loginType: "email",
        role: tempData.role || null,
      });
    }
    delete tempUserStorage[email];
    const token = generateEmployerToken(user);
    res.status(200).json({
      message: "OTP verified",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "OTP verification failed", error: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token, role } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        loginType: "google",
        isVerified: true,
        role: role || "employer",
      });
    } else if (!user.role && role) {
      user.role = role;
    }
    await user.save();
    const jwtToken = generateEmployerToken(user);
    res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Google login failed",
      error: error.message,
    });
  }
};


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-otp");
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: err.message });
  }
};
