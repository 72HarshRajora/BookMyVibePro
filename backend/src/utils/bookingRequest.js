import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",   // ✅ service ki jagah host likho
    port: 587,                 // ✅ 465 ki jagah 587
    secure: false,             // ✅ 587 ke liye false
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendRequest = async (email, data) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "New Booking Request",
        text: `Hi ${data.vendor},\n
You have received a new booking request. Here are the details:\n
    Service: ${data.service}\n
    Customer: ${data.customer}\n
    Email: ${data.email}\n
    Phone: ${data.phone}\n
    Date: ${data.date}\n
    Time: ${data.time}\n
    Address: ${data.address}`
    })
}

const sendResponse = async (email, data, status) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Booking ${status}`,
        text: `Hi ${data.customer},\n
Your booking has been ${status} by the vendor.\n
    Event: ${data.event}\n
    Vendor: ${data.vendor}\n
    Date: ${data.date}\n
    Time: ${data.time}\n
    Amount: ${data.amount}\n
    Status: ${status}`
    })
}

export { sendRequest, sendResponse }