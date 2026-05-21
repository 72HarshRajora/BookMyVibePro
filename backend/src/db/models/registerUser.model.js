import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'vendor', 'admin'],
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otp: String,
    otpExpiry: Date
}, {
    // timestamps: true
    timestamps: {
        createdAt: "created_on",
        updatedAt: "updated_on"
    }
})

const userModel = mongoose.model("user", userSchema)

export default userModel;


// "name":""
// "email":"@gmail.com"
// "password":""
// "confirmPassword":""
// "role":""