import jwt from "jsonwebtoken"
import userModel from "../db/models/registerUser.model.js"
import bcrypt from "bcrypt"
import sendEmailOtp from "../utils/setupOtpSender.js"
import masterModel from "../db/models/masterOtp.model.js"

const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role = "user" } = req.body

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password mismatch!"
            })
        }

        const isUserExist = await userModel.findOne({
            email
        })

        if (isUserExist && isUserExist.isVerified) {
            return res.status(409).json({
                message: "User already exists"
            });
        } else {
            await userModel.findOneAndDelete({
                email
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const generateOtp = () => {
            return Math.floor(100000 + Math.random() * (999999 - 100000)).toString()
        }

        const otp = generateOtp()
        await sendEmailOtp(email, otp)

        const hashedOtp = await bcrypt.hash(otp, 10)

        const user = await userModel.create({
            name,
            email,
            password: hashPassword,
            role,
            otp: hashedOtp,
            otpExpiry: Date.now() + (5 * 60 * 1000)
        })

        // Only for Admin
        if (user.role === "admin") {
            let masterOtp = Math.floor(100000 + Math.random() * (999999 - 100000)).toString()
            const masterEmail = process.env.MASTER_EMAIL

            await sendEmailOtp(masterEmail, masterOtp)
            masterOtp = await bcrypt.hash(masterOtp, 10)

            await masterModel.create({
                email: user.email,
                masterOtp,
                masterOtpExpiry: Date.now() + (5 * 60 * 1000)
            })
        }

        res.status(201).json({
            message: "Otp send successfully.",
            user: {
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

const sendOtp = async (req, res) => {

    const { email } = req.body
    const user = await userModel.findOne({ email })

    if ((user.otpExpiry - (4 * 60 * 1000)) > Date.now()) {
        return res.status(429).json({ message: "Wait before requesting again" });
    }

    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * (999999 - 100000)).toString()
    }

    const otp = generateOtp()

    await sendEmailOtp(email, otp)

    const hashedOtp = await bcrypt.hash(otp, 10)
    user.otp = hashedOtp
    user.otpExpiry = Date.now() + (5 * 60 * 1000)

    await user.save()

    // Only for Admin
    if (user.role === "admin") {
        let masterOtp = Math.floor(100000 + Math.random() * (999999 - 100000)).toString()
        const masterEmail = process.env.MASTER_EMAIL

        await sendEmailOtp(masterEmail, masterOtp)
        masterOtp = await bcrypt.hash(masterOtp, 10)

        await masterModel.create({
            email: user.email,
            masterOtp,
            masterOtpExpiry: Date.now() + (5 * 60 * 1000)
        })
    }

    res.status(200).json({
        message: "Otp send successfully.",
        email
    })
}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body

    const user = await userModel.findOne({ email })
    const isCorrectOtp = await bcrypt.compare(otp, user.otp)

    if (!isCorrectOtp || user.otpExpiry < Date.now()) {
        return res.status(400).json({
            message: "Invalid or expired OTP"
        });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;

    // Only for Admin
    if (user.role === "admin") {
        const { masterOtp } = req.body

        const admin = await masterModel.findOne({ email })
        const isCorrectMasterOtp = await bcrypt.compare(masterOtp, admin.masterOtp)

        if (!isCorrectMasterOtp || admin.masterOtpExpiry < Date.now()) {
            return res.status(400).json({
                message: "Invalid or expired OTP"
            })
        }

        await admin.deleteOne()
        user.isVerified = true
    } else {
        user.isVerified = true
    }

    await user.save()

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)

    const isProduction = process.env.NODE_ENV === "production"

    res.cookie("BookMyVibe-token", token, {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        success: true,
        message: "Verified Successfully."
    })
}

const loginUser = async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(401).json({
            message: "Invalid credential"
        })
    }

    const isCorrect = await bcrypt.compare(password, user.password)

    if (!isCorrect) {
        return res.status(401).json({
            message: "Invalid credential"
        })
    }

    if (!user.isVerified) {
        return res.status(403).json({
            message: "Verify your account first"
        });
    }

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)

    const isProduction = process.env.NODE_ENV === "production"

    res.cookie("BookMyVibe-token", token, {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction,
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
}

const logoutUser = async (req, res) => {
    res.clearCookie("BookMyVibe-token")

    res.status(200).json({
        message: "User logged out successfully."
    })
}

export { registerUser, sendOtp, verifyOtp, loginUser, logoutUser }