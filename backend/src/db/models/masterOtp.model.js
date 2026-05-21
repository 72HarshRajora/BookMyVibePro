import mongoose from "mongoose";

const masterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    masterOtp: String,
    masterOtpExpiry: Date
})

const masterModel = mongoose.model("MasterOtp", masterSchema)

export default masterModel;