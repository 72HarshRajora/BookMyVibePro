import { useContext, useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import "../styles/Login.css"
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()
  const { login, user } = useContext(AuthContext)

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
    const res = await fetch("https://bookmyvibepro.onrender.com/api/auth/login", {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify(data)
    })

    const result = await res.json()

    if (!res.ok) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    login(result.user)

    if (result.user.role === "admin") { navigate("/admin-dashboard") }
    else if (result.user.role === "vendor") { navigate("/vendor-dashboard") }
    else { navigate("/user-profile") }
  }

  return (
    <div className="parent">
      <div className='signup'>
        <h1>Welcome Back</h1>
        <form className='form' onSubmit={handleSubmit(onSubmit)}>
          <div className="form-child">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder='Enter your email' {...register("email", {
              required: { value: true, message: "This field is required!" },
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

          <button type="submit" className='submit-btn' disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Login"}</button>

          <p>Don't have an account? <NavLink to="/register">Sign Up</NavLink></p>
        </form>
      </div>
    </div>
  )
}

export default Login
