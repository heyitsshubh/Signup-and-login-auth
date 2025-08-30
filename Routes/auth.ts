import { Router } from "express";
import { signup,verifyOtp } from "../Controllers/authcontroller";
import { validateSignup } from "../Middlewares/validation";


const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/verify-otp', verifyOtp);

export default router;