import express from "express";
import verifyToken from "../middlewares/auth.middleware.js";
import { deleteBooking, editBooking, getBookingDetails, getBookings, getProfile, updateProfile } from "../controllers/users.controller.js";

const router = express.Router()

router.get("/profile", verifyToken, getProfile)
router.patch("/update-profile", verifyToken, updateProfile)
router.get("/bookings", verifyToken, getBookings)
router.get("/bookings/:bookingId", verifyToken, getBookingDetails)
router.patch("/bookings/:bookingId", verifyToken, editBooking)
router.delete("/bookings/:bookingId", verifyToken, deleteBooking)

export default router;