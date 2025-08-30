import { Request, Response } from "express";
import User from "../Models/UserSchema";
import Otp from "../Models/Otp";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {sendMail} from "../utils/sendMail";
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export const signup:any = async (req: Request, res: Response): Promise<Response | void> => {
    const { name, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const usernameExists = await User.findOne({ name });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const otp = crypto.randomInt(100000, 999999).toString();
        const newOtp = new Otp({ email, otp });
        await newOtp.save(); // Save OTP to the database
        console.log(`Generated OTP: ${otp}`);


        try {
            await sendMail(email, "Verify your email", `Your OTP is ${otp}`);
            console.log(`OTP sent to email: ${email}`);
        } catch (error) {
            console.error('Error sending OTP email:', error);
            return res.status(500).json({ message: "Server error", error: "Error sending email" });
        }

        res.status(201).json({ message: "User created successfully" });
    } catch (error: any) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

    export const verifyOtp: any = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({ message: "Email and OTP are required" });
            }

            const otpRecord = await Otp.findOne({ email, otp });

            if (!otpRecord) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            await User.updateOne({ email }, { $set: { isVerified: true } });
            await Otp.deleteOne({ email });

            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const payload = { id: user._id, email: user.email };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            return res.status(200).json({
                message: "OTP verified successfully",
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.error("OTP verification error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    };

    export const login: any = async (req: Request, res: Response): Promise<Response | void> => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid email or password" });
            }

            const payload = { id: user._id, email: user.email };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);

            return res.status(200).json({
                message: "Login successful",
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ message: "Server error" });
        }
    };
