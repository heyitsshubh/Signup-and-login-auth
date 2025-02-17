import { Request, Response } from "express";
import User from "../Models/UserSchema";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {sendMail} from "../utils/sendMail";

// Signup controller
export const signup:any = async (req: Request, res: Response): Promise<Response | void> => {
    const { username, email, password } = req.body;

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
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const otp = crypto.randomInt(100000, 999999).toString();

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