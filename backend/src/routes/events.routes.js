import express from 'express'
import { getEventDetails, getEvents, getVendorDetails } from '../controllers/events.controller.js'

const router = express.Router()

router.get("/get-events", getEvents)
router.get("/get-events/:id", getEventDetails)
router.get("/vendor/:vendorId", getVendorDetails)

export default router