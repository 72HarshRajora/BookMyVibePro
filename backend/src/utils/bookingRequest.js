import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo"

const apiInstance = new TransactionalEmailsApi()

apiInstance.setApiKey(
    TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
)

const sendRequest = async (email, data) => {
    await apiInstance.sendTransacEmail({
        sender: {
            email: process.env.EMAIL_USER,
            name: "BookMyVibe"
        },
        to: [{ email }],
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
    await apiInstance.sendTransacEmail({
        sender: {
            email: process.env.EMAIL_USER,
            name: "BookMyVibe"
        },
        to: [{ email }],
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