import { Request, Response } from "express";
import User from "../Models/UserSchema";
import bcrypt from "bcrypt";

// signup controller
export const signup:any = async (req: Request, res: Response): Promise<Response | void> => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error:any) {
        res.status(500).json({ message: "Server error" });
    }
};