import userModel from "../db/models/registerUser.model.js"
import bookingModel from '../db/models/booking.model.js'

const dashboard = async (req, res) => {
    const admin = await userModel.findById(req.user.id)

    if (!admin) {
        return res.status(404).json({
            message: "Admin not found."
        })
    }

    res.status(200).json({
        message: "Dashboard details fetch successfully",
        admin: {
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            role: admin.role,
            dateOfJoin: admin.created_on.toLocaleDateString("en-IN")
        }
    })
}

const getUsers = async (req, res) => {
    const users = await userModel.find({ role: "user" }).select("name email phone created_on")

    res.status(200).json({
        message: "List of users fetch successfully",
        users
    })
}

const getUserBookings = async (req, res) => {
    const userId = req.params.userId
    const bookings = await bookingModel.find({user: userId}).populate("event", "title")
    const bookingsArr = bookings.map(booking => {
        return ({
            eventName: booking.event.title,
            dateTime: `${booking.date.toLocaleDateString()} at ${booking.time}`,
            location: Object.values(booking.address).join(", "),
            bookingDate: booking.created_on.toLocaleDateString()
        })
    })

    res.status(200).json({
        message: "User bookings fetch successfully.",
        bookings: bookingsArr
    })
}

const getVendors = async (req, res) => {
    const vendors = await userModel.find({ role: "vendor" }).select("name email phone created_on")

    res.status(200).json({
        message: "List of vendors fetch successfully.",
        vendors
    })
}

const getVendorBookings = async (req, res) => {
    const vendorId = req.params.vendorId
    const bookings = await bookingModel.find({vendor: vendorId}).populate([
        {path: "user", select: "name email"},
        {path: "event", select: "title"}
    ])

    const bookingsArr = bookings.map(booking => {
        return ({
            customer: booking.user.name,
            email: booking.user.email,
            eventName: booking.event.title,
            dateTime: `${booking.date.toLocaleDateString()} at ${booking.time}`,
            location: Object.values(booking.address).join(", "),
            bookingDate: booking.created_on.toLocaleDateString()
        })
    })

    res.status(200).json({
        message: "Vendor bookings fetch successfully.",
        bookings: bookingsArr
    })
}

const deleteUser = async (req, res) => {
    const userId = req.params.userId
    await userModel.findByIdAndDelete(userId)

    res.status(200).json({
        message: "User deleted successfully."
    })
}

const deleteVendor = async (req, res) => {
    const vendorId = req.params.vendorId
    await userModel.findByIdAndDelete(vendorId)

    res.status(200).json({
        message: "Vendor deleted successfully."
    })
}

export { dashboard, getUsers, getUserBookings, getVendors, getVendorBookings, deleteUser, deleteVendor }