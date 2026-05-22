import { useContext, useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from "lucide-react"
import "../styles/Signup.css"
import toast from 'react-hot-toast'
import { NavLink, useNavigate } from "react-router-dom"
import { AuthContext } from '../context/AuthContext'

const Signup = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()

    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) return

        if (user.role === "admin") {
            navigate("/admin-dashboard")
        }
        else if (user.role === "vendor") {
            navigate("/vendor-dashboard")
        }
        else {
            navigate("/user-profile")
        }
    }, [user, navigate])

    const onSubmit = async (data) => {
        const res = await fetch("https://bookmyvibepro.onrender.com/api/auth/register", {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            method: "POST",
            body: JSON.stringify({
                ...data,
                role
            })
        })

        const result = await res.json()

        if (!res.ok) {
            toast.error(result.message)
            return
        }

        toast.success(result.message)
        localStorage.setItem("userData",
            JSON.stringify({
                name: data.name,
                email: data.email
            })
        )
        navigate("/verify-otp")
    }

    const [showPass, setShowPass] = useState(false)
    const [showConf, setShowConf] = useState(false)

    const [role, setRole] = useState("user")

    const handleRoleChange = (newRole) => {
        setRole(newRole)
    }

    const password = watch("password")

    return (
        <div className="parent">
            <div className='signup'>
                <h1>Create Account</h1>

                <form onSubmit={handleSubmit(onSubmit)} className='form'>
                    <div className="role-selector">
                        <button type="button" className={`role-btn ${role === "user" ? "active" : ""}`} onClick={() => handleRoleChange("user")}>User</button>
                        <button type="button" className={`role-btn ${role === "vendor" ? "active" : ""}`} onClick={() => handleRoleChange("vendor")}>Vendor</button>
                    </div>

                    <div className="form-child">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" id="name" placeholder='Enter your name' {...register("name", {
                            required: { value: true, message: "This field is required!" },
                            minLength: { value: 3, message: "Min length is 3!" },
                            maxLength: { value: 15, message: "Max length is 15" }
                        })} />
                        {errors.name && <p className='form-error'>{errors.name.message}</p>}
                    </div>

                    <div className="form-child">
                        <label htmlFor='email'>Email Address</label>
                        <input type="email" id="email" placeholder='Enter your email' {...register("email", {
                            required: { value: true, message: "This field is required!" },
                            minLength: { value: 12, message: "Invalid Email!" }
                        })} />
                        {errors.email && <p className='form-error'>{errors.email.message}</p>}
                    </div>

                    <div className="form-child">
                        <label htmlFor="password">Password</label>
                        <input type={showPass ? "text" : "password"} id="password" placeholder='Create a password' {...register("password", {
                            required: { value: true, message: "This field is required!" },
                            minLength: { value: 5, message: "Password is too short!" }
                        })} />
                        <button type="button" className="eye" onClick={() => setShowPass(!showPass)}>{showPass ? <Eye /> : <EyeOff />}</button>
                        {errors.password && <p className='form-error'>{errors.password.message}</p>}
                    </div>

                    <div className="form-child">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type={showConf ? "text" : "password"} id="confirmPassword" placeholder='Confirm the password' {...register("confirmPassword", {
                            required: { value: true, message: "This field is required!" },
                            minLength: { value: 5, message: "Password is too short!" },
                            validate: (value) => {
                                return value === password || "Passwords do not match!"
                            }
                        })} />
                        <button type="button" className="eye" onClick={() => setShowConf(!showConf)}>{showConf ? <Eye /> : <EyeOff />}</button>
                        {errors.confirmPassword && <p className='form-error'>{errors.confirmPassword.message}</p>}
                    </div>

                    <button type="submit" className='submit-btn' disabled={isSubmitting}>{isSubmitting ? "Sending Otp..." : "Continue"}</button>

                    <p>Already have an account? <NavLink to="/login">Login</NavLink></p>
                </form>
            </div>
        </div>
    )
}

export default Signup
