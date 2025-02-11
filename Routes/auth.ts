import { Router } from "express";
import { signup } from "../Controllers/authcontroller";

const router = Router();

router.post('/signup', signup);

export default router;