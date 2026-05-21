import express from 'express'
import verifyAdmin from "../middlewares/admin.middleware.js"
import { dashboard, deleteUser, deleteVendor, getUserBookings, getUsers, getVendorBookings, getVendors } from '../controllers/admin.controller.js'
import verifyToken from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get("/", verifyToken, verifyAdmin, dashboard)
router.get("/get-users", verifyToken, verifyAdmin, getUsers)
router.get("/get-user-details/:userId", verifyToken, verifyAdmin, getUserBookings)
router.delete("/delete-user/:userId", verifyToken, verifyAdmin, deleteUser)
router.get("/get-vendors", verifyToken, verifyAdmin, getVendors)
router.get("/get-vendor-details/:vendorId", verifyToken, verifyAdmin, getVendorBookings)
router.delete("/delete-vendor/:vendorId", verifyToken, verifyAdmin, deleteVendor)

export default router