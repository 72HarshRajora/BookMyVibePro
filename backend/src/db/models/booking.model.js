import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
        required: true
    },
    price: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        maxlength: 10
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["confirmed", "cancelled", "pending"],
        default: "pending",
        required: true
    },
}, {
    timestamps: {
        createdAt: "created_on",
        updatedAt: "updated_on"
    }
})

const bookingModel = mongoose.model("booking", bookingSchema)

export default bookingModel;