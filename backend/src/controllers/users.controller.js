import bookingModel from "../db/models/booking.model.js"
import userModel from "../db/models/registerUser.model.js"

const getProfile = async (req, res) => {
    const user = await userModel.findById(req.user.id)

    if (!user) {
        return res.status(404).json({
            message: "User not found."
        })
    }

    res.status(200).json({
        message: "Profile details fetch successfully",
        user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            dateOfJoin: user.created_on.toLocaleDateString("en-IN")
        }
    })
}

const updateProfile = async (req, res) => {
    const { name, phone } = req.body
    const user = await userModel.findById(req.user.id)

    user.name = name
    user.phone = phone
    await user.save()

    res.status(200).json({
        message: "Profile details updated successfully",
        user: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            dateOfJoin: user.created_on.toLocaleDateString("en-IN")
        }
    })
}

const getBookings = async (req, res) => {
    const bookings = await bookingModel.find({ user: req.user.id }).populate([
        { path: "vendor", select: "name" },
        { path: "event", select: "title" }
    ])

    const bookingsArr = bookings.map(booking => {
        return (
            {
                id: booking._id,
                vendor: booking.vendor.name,
                event: booking.event.title,
                eventId: booking.event._id,
                price: booking.price,
                date: booking.date.toISOString(),
                time: booking.time,
                phone: booking.phone,
                address: Object.values(booking.address).join(", "),
                bookedOn: booking.created_on.toLocaleString("en-IN"),
                status: booking.status
            }
        )
    })

    res.status(200).json({
        message: "User's bookings fetch successfully.",
        bookings: bookingsArr
    })
}

const getBookingDetails = async (req, res) => {
    const bookingId = req.params.bookingId

    const booking = await bookingModel.findById(bookingId).populate([
        { path: "event", select: "title" }
    ])

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found."
        })
    }

    if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({
            message: "Not allowed to edit this booking"
        });
    }

    res.status(200).json({
        message: "Booking details fetched successfully.",
        booking: {
            event: booking.event.title,
            price: booking.price,
            date: booking.date.toISOString().split("T")[0],
            time: booking.time,
            phone: booking.phone,
            address: booking.address,
            bookedOn: booking.created_on.toLocaleString("en-IN"),
            status: booking.status
        }
    })
}

const editBooking = async (req, res) => {
    const bookingId = req.params.bookingId

    const booking = await bookingModel.findById(bookingId)

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found."
        })
    }

    if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({
            message: "Not allowed to edit this booking"
        });
    }

    const now = new Date()
    const diffDate = booking.date.getTime() - now.getTime()

    if (diffDate < (24 * 60 * 60 * 1000)) {
        return res.status(400).json({
            message: "You can't edit/delete booking within 24 hours."
        });
    }

    const { phone, street, city, state, pincode, date, time } = req.body

    booking.phone = phone
    booking.address.street = street
    booking.address.city = city
    booking.address.state = state
    booking.address.pincode = pincode

    const bookingDate = new Date(date)
    bookingDate.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (bookingDate < today) {
        return res.status(400).json({
            message: "Cannot set past date."
        })
    }

    booking.date = bookingDate
    booking.time = time

    await booking.save()

    res.status(200).json({
        message: "Booking details updated successfully."
    })
}

const deleteBooking = async (req, res) => {
    const bookingId = req.params.bookingId

    const booking = await bookingModel.findById(bookingId)

    if (!booking) {
        return res.status(404).json({
            message: "Booking not found."
        })
    }

    if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({
            message: "Not allowed to edit this booking"
        });
    }

    const now = new Date()
    const diffDate = booking.date.getTime() - now.getTime()

    if (diffDate < (24 * 60 * 60 * 1000)) {
        return res.status(400).json({
            message: "You can't edit/delete booking within 24 hours."
        });
    }

    await booking.deleteOne()

    res.status(200).json({
        message: "Booking deleted successfully."
    })
}

export { getProfile, updateProfile, getBookings, getBookingDetails, editBooking, deleteBooking }