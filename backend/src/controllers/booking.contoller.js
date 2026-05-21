import bookingModel from "../db/models/booking.model.js"
import eventModel from "../db/models/events.model.js"
import { sendRequest } from "../utils/bookingRequest.js"

const createBooking = async (req, res) => {
    const user = req.user.id
    const { eventId, phone, street, city, state, pincode, date, time } = req.body

    const bookingDate = new Date(date)
    bookingDate.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if(bookingDate < today){
        return res.status(400).json({
            message: "Cannot accept booking of past dates."
        })
    }

    const event = await eventModel.findById(eventId)

    if(!event){
        return res.status(404).json({
            message: "Event not found."
        })
    }

    const existBooking = await bookingModel.findOne({
        user,
        event: eventId,
        date: bookingDate
    })

    if(existBooking){
        return res.status(409).json({
            message: "This slot already booked."
        })
    }

    const booking = await bookingModel.create({
        user,
        vendor: event.vendor,
        event: eventId,
        price: event.price,
        phone,
        address: {
            street,
            city,
            state,
            pincode
        },
        date: bookingDate,
        time
    })

    // Send Booking Request Email to Vendor
    const bookingData = await booking.populate(
        [
            {path: "user", select: "name email"},
            {path: "vendor", select: "name email"},
            {path: "event", select: "title"}
        ]
    )
    const address = Object.values(booking.address).join(", ")
    const formattedDate = new Date(bookingData.date).toLocaleDateString("en-IN")

    const data = {
        vendor: bookingData.vendor.name,
        service: bookingData.event.title,
        customer: bookingData.user.name,
        email: bookingData.user.email,
        phone: bookingData.phone,
        date: formattedDate,
        time: bookingData.time,
        address
    }
    const email = bookingData.vendor.email

    await sendRequest(email, data)

    res.status(201).json({
        message: "Booking request send successfully.",
        bookingData
    })
}

export { createBooking }