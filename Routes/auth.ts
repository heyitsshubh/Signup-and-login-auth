import { Router } from "express";
import { signup,verifyOtp } from "../Controllers/authcontroller";


const router = Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);

export default router;