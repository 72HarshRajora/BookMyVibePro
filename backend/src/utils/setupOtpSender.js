import nodemailer from "nodemailer"

const sendEmailOtp = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",   // ✅ service ki jagah host likho
        port: 587,                 // ✅ 465 ki jagah 587
        secure: false,             // ✅ 587 ke liye false
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP Verification by BookMyVibe",
        text: `Your OTP is ${otp}`
    })
}

export default sendEmailOtp