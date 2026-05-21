import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import "../styles/VerifyOtp.css"

const VerifyOtp = () => {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm()

    const sendOtp = async (email) => {
        const res = await fetch("https://bookmyvibepro.onrender.com/api/auth/send-otp", {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            method: "POST",
            body: JSON.stringify({ email })
        })

        const result = await res.json()
        if (!res.ok) {
            toast.error(result.message)
            return
        }

        toast.success(result.message)
    }

    const userData = JSON.parse(localStorage.getItem("userData"))

    const navigate = useNavigate()

    const onSubmit = async (data) => {
        const res = await fetch("https://bookmyvibepro.onrender.com/api/auth/verify-otp", {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            method: "POST",
            body: JSON.stringify({
                email: userData?.email,
                otp: data.otp
            })
        })
    }

    const [timer, setTimer] = useState(60)

    useEffect(() => {
        if (timer === 0) return

        const interval = setTimeout(() => {
            setTimer(prev => prev - 1)
        }, 1000);

        return () => clearTimeout(interval)
    }, [timer])


    return (
        <div className="parent">
            <div className='signup'>
                <h1>Create Account</h1>
                <form className='form' onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-child">
                        <label htmlFor="otp" className='label-text'>{`Enter OTP (send to ${userData?.email})`}</label>
                        <input type="text" id="otp" {...register("otp")} />
                        <button type="button" className='resend' onClick={() => {
                            sendOtp(userData?.email)
                            setTimer(60)
                        }} disabled={timer > 0}>{(timer === 0 ? "Resend OTP" : `Resend OTP in ${timer}sec.`)}</button>
                    </div>
                    <div className="buttons">
                        <button type="submit" className='submit-btn'>Complete Signup</button>
                        <button type="button" onClick={() => navigate(-1)}>Back</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default VerifyOtp