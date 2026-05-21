const sendEmailOtp = async (email, otp) => {
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
            to: [
                {
                    email
                }
            ],
            subject: "OTP Verification by BookMyVibe",
            textContent: `Your OTP is ${otp}`
        })
    })

    if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
    }
}

export default sendEmailOtp