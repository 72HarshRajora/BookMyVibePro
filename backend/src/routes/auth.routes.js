import express from "express";
import { loginUser, logoutUser, registerUser, sendOtp, verifyOtp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser)
router.post("/send-otp", sendOtp)
router.post("/verify-otp", verifyOtp)
router.post("/login", loginUser)
router.post("/logout", logoutUser)

export default router