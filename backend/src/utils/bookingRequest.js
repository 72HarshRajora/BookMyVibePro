const sendMail = async ({ email, subject, textContent }) => {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify({
            sender: {
                name: "BookMyVibe",
                email: process.env.EMAIL_USER
            },
            to: [{ email }],
            subject,
            textContent
        })
    })

    if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
    }
}

const sendRequest = async (email, data) => {
    await sendMail({
        email,
        subject: "New Booking Request",
        textContent: `Hi ${data.vendor},

You have received a new booking request.

Service: ${data.service}
Customer: ${data.customer}
Email: ${data.email}
Phone: ${data.phone}
Date: ${data.date}
Time: ${data.time}
Address: ${data.address}`
    })
}

const sendResponse = async (email, data, status) => {
    await sendMail({
        email,
        subject: `Booking ${status}`,
        textContent: `Hi ${data.customer},

Your booking has been ${status}.

Event: ${data.event}
Vendor: ${data.vendor}
Date: ${data.date}
Time: ${data.time}
Amount: ${data.amount}
Status: ${status}`
    })
}

export { sendRequest, sendResponse }