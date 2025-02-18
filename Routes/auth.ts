import { Router } from "express";
import { signup } from "../Controllers/authcontroller";
import { verify } from "crypto";

const router = Router();

router.post('/signup', signup);

export default router;