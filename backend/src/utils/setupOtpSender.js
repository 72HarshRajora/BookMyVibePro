import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo"

const sendEmailOtp = async (email, otp) => {
    const apiInstance = new TransactionalEmailsApi()

    apiInstance.setApiKey(
        TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
    )

    await apiInstance.sendTransacEmail({
        sender: {
            email: process.env.EMAIL_USER,
            name: "BookMyVibe"
        },
        to: [{ email }],
        subject: "OTP Verification by BookMyVibe",
        textContent: `Your OTP is ${otp}`
    })
}

export default sendEmailOtp