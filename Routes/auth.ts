import { Router } from "express";
import { signup, verifyOtp, login } from "../Controllers/authcontroller";
import { validateSignup } from "../Middlewares/validation";

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/verify-otp', verifyOtp);
router.post('/login',login);

export default router;