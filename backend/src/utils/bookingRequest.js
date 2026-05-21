import * as Brevo from "@getbrevo/brevo"

const apiInstance = new Brevo.TransactionalEmailsApi()
apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
)

const sendRequest = async (email, data) => {
    await apiInstance.sendTransacEmail({
        sender: { email: process.env.EMAIL_USER, name: "BookMyVibe" },
        to: [{ email }],
        subject: "New Booking Request",
        textContent: `Hi ${data.vendor},\n\nYou have received a new booking request. Here are the details:\n\n    Service: ${data.service}\n    Customer: ${data.customer}\n    Email: ${data.email}\n    Phone: ${data.phone}\n    Date: ${data.date}\n    Time: ${data.time}\n    Address: ${data.address}`
    })
}

const sendResponse = async (email, data, status) => {
    await apiInstance.sendTransacEmail({
        sender: { email: process.env.EMAIL_USER, name: "BookMyVibe" },
        to: [{ email }],
        subject: `Booking ${status}`,
        textContent: `Hi ${data.customer},\n\nYour booking has been ${status} by the vendor.\n\n    Event: ${data.event}\n    Vendor: ${data.vendor}\n    Date: ${data.date}\n    Time: ${data.time}\n    Amount: ${data.amount}\n    Status: ${status}`
    })
}

export { sendRequest, sendResponse }