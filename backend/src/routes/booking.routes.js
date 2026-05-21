import express from 'express'
import { createBooking } from '../controllers/booking.contoller.js'
import verifyToken from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post("/create", verifyToken, createBooking)

export default router