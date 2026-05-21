import eventModel from "../db/models/events.model.js"
import userModel from "../db/models/registerUser.model.js"

const getEvents = async (req, res) => {
    const events = await eventModel.find().populate("vendor", "name")
    const eventArr = events.map(events => ({
        id: events._id,
        vendor: events.vendor.name,
        title: events.title,
        price: events.price,
        category: events.category,
        availability: events.availability,
        image: events.image.url
    }))

    res.status(200).json({
        message: "Events fetch successfully.",
        events: eventArr
    })
}

const getEventDetails = async (req, res) => {
    const id = req.params.id
    const event = await eventModel.findById(id).populate("vendor", "name")

    if(!event){
        return res.status(404).json({
            message: "Event not found."
        })
    }

    res.status(200).json({
        message: "Event details fetch successfully",
        event: {
            vendor: event.vendor,
            title: event.title,
            desc: event.desc,
            price: event.price,
            category: event.category,
            availability: event.availability,
            image: event.image.url
        }
    })
}

const getVendorDetails = async (req, res) => {
    const vendorId = req.params.vendorId
    const vendor = await userModel.findById(vendorId).select("name role isVerified created_on")
    const events = await eventModel.find({vendor: vendorId}).select("_id title price category availability")

    res.status(200).json({
        message: "Vendor details fetch successfully.",
        vendor,
        events
    })
}

export { getEvents, getEventDetails, getVendorDetails }