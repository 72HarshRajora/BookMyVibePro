import cloudinary from "../config/cloudinary.config.js"
import bookingModel from "../db/models/booking.model.js";
import eventModel from "../db/models/events.model.js"
import { sendResponse } from "../utils/bookingRequest.js";
import uploadFile from "../utils/cloudinaryFileUpload.js"

const createEvent = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ message: "Image required" });
    }

    const result = await uploadFile(req.file)

    const { title, desc, price, category, availability } = req.body

    const event = await eventModel.create({
        vendor: req.user.id,
        title,
        desc,
        price,
        category,
        availability,
        image: {
            url: result.secure_url,
            public_id: result.public_id
        }
    })

    res.status(201).json({
        message: "Event created successfully."
    })
}

const vendorEvents = async (req, res) => {

    const events = await eventModel.find({
        vendor: req.user.id
    })

    res.status(200).json({
        message: "Events fetch successfully.",
        events
    })
}

const vendorEvent = async (req, res) => {
    const eventId = req.params.eventId

    const event = await eventModel.findById(eventId)

    if(!event){
        return res.status(404).json({
            message: "Event not found."
        })
    }

    res.status(200).json({
        message: "Event details fetch successfully.",
        event
    })
}

const updateEvent = async (req, res) => {

    const eventId = req.params.id
    const { title, desc, price, category, availability } = req.body

    const event = await eventModel.findById(eventId)

    if (!event) {
        return res.status(404).json({
            message: "Event not found."
        })
    }
    
    if (event.vendor.toString() !== req.user.id) {
        return res.status(403).json({
            message: "You haven't access to change event details."
        })
    }

    let newImage = event.image

    if (req.file) {
        await cloudinary.uploader.destroy(event.image.public_id)
        const result = await uploadFile(req.file)

        newImage = {
            url: result.secure_url,
            public_id: result.public_id
        }
    }

    await eventModel.findByIdAndUpdate(eventId, {
        title,
        desc,
        price,
        category,
        availability,
        image: newImage
    })

    res.status(200).json({
        message: "Event updated successfully."
    })
}

const deleteEvent = async (req, res) => {
    const eventId = req.params.id
    const event = await eventModel.findById(eventId)

    if (event.vendor.toString() !== req.user.id) {
        return res.status(403).json({
            message: "You haven't access to change event details."
        })
    }

    if (!event) {
        return res.status(404).json({
            message: "Event not found."
        })
    }

    await cloudinary.uploader.destroy(event.image.public_id)
    await eventModel.findByIdAndDelete(eventId)

    res.status(200).json({
        message: "Event deleted successfully."
    })
}

const vendorBookings = async (req, res) => {
    const bookings = await bookingModel.find({ vendor: req.user.id }).populate([
        { path: "user", select: "name email" },
        { path: "event", select: "title" }
    ])

    const bookingsArr = bookings.map(booking => {
        return (
            {
                id: booking._id,
                customer: booking.user.name,
                email: booking.user.email,
                service: booking.event.title,
                date: booking.date.toLocaleDateString("en-IN"),
                time: booking.time,
                phone: booking.phone,
                address: Object.values(booking.address).join(", "),
                bookedOn: booking.created_on.toLocaleString("en-IN"),
                status: booking.status
            }
        )
    })

    res.status(200).json({
        message: "Vendor's bookings fetch successfully.",
        bookings: bookingsArr
    })
}

const sendResponseEmail = async (req, res) => {
    const bookingId = req.params.bookingId
    const { status } = req.body

    const booking = await bookingModel.findById(bookingId)
    if (!booking) {
        return res.status(404).json({
            message: "Booking doesn't exists."
        })
    }

    booking.status = status
    await booking.save()

    const bookingData = await booking.populate([
        { path: "user", select: "name email" },
        { path: "vendor", select: "name" },
        { path: "event", select: "title price" }
    ])

    const email = bookingData.user.email
    const data = {
        customer: bookingData.user.name,
        event: bookingData.event.title,
        vendor: bookingData.vendor.name,
        date: bookingData.date.toLocaleDateString("en-IN"),
        time: bookingData.time,
        amount: `${bookingData.event.price}Rs.`
    }

    await sendResponse(email, data, status)

    res.status(200).json({
        message: "Response send successfully."
    })
}

export { createEvent, vendorEvents, vendorEvent, updateEvent, deleteEvent, vendorBookings, sendResponseEmail }