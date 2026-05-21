import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        required: true
    },
    image: {
        url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        }
    },
}, {
    timestamps: {
        createdAt: "created_on",
        updatedAt: "updated_on"
    }
})

const eventModel = mongoose.model("event", eventSchema)

export default eventModel