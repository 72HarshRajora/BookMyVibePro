import express from "express";
import verifyToken from "../middlewares/auth.middleware.js"
import verifyVendor from "../middlewares/vendor.middleware.js"
import { createEvent, deleteEvent, sendResponseEmail, updateEvent, vendorBookings, vendorEvent, vendorEvents } from "../controllers/vendor.controller.js";
import multer from "multer"

const router = express.Router()
const upload = multer({storage: multer.memoryStorage()})

router.post("/events", verifyToken, verifyVendor, upload.single("image"), createEvent)
router.get("/events", verifyToken, verifyVendor, vendorEvents)
router.get("/event/:eventId", verifyToken, verifyVendor, vendorEvent)
router.patch("/events/:id", verifyToken, verifyVendor, upload.single("image"), updateEvent)
router.delete("/events/:id", verifyToken, verifyVendor, deleteEvent)
router.get("/bookings", verifyToken, verifyVendor, vendorBookings)
router.post("/bookings/:bookingId", verifyToken, verifyVendor, sendResponseEmail)

export default router