import { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from "react-hot-toast"
import "../styles/EditBooking.css"
import {AuthContext} from "../context/AuthContext"

const EditBooking = () => {

    const { bookingId } = useParams()
    const [booking, setBooking] = useState(null)

    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    if (!user) navigate("/login")

    const onSubmit = async (data) => {
        const res = await fetch(`https://bookmyvibepro.onrender.com/api/users/bookings/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            method: "PATCH",
            body: JSON.stringify(data)
        })

        const result = await res.json()

        if (!res.ok) {
            toast.error(result.message)
            return
        }

        toast.success(result.message)

        if (user.role === "admin") {
            navigate("/admin-dashboard")
        }
        else if (user.role === "vendor") {
            navigate("/vendor-dashboard")
        }
        else {
            navigate("/user-profile")
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === "street" || name === "city" || name === "state" || name === "pincode") {
            setBooking(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: value
                }
            }))
        } else {
            setBooking(prev => ({
                ...prev,
                [name]: value
            }))
        }
    }


    const handleDelete = async () => {
        const res = await fetch(`https://bookmyvibepro.onrender.com/api/users/bookings/${bookingId}`, {
            credentials: "include",
            method: "DELETE"
        })

        const result = await res.json()

        if (!res.ok) {
            toast.error(result.message)
            return
        }

        toast.success(result.message)

        if (user.role === "admin") {
            navigate("/admin-dashboard")
        }
        else if (user.role === "vendor") {
            navigate("/vendor-dashboard")
        }
        else {
            navigate("/user-profile")
        }
    }

    useEffect(() => {
        (async () => {
            const res = await fetch(`https://bookmyvibepro.onrender.com/api/users/bookings/${bookingId}`, {
                credentials: "include"
            })
            const result = await res.json()
            setBooking(result.booking)
        })()
    }, [])

    let today = new Date().toISOString().split("T")[0]

    return (
        <div className='editBooking'>
            <div className="heading">
                <h1>Edit Booking</h1>
                <button type="button" onClick={() => nevigate(-1)}>Back to My Bookings</button>
            </div>

            <div className="bookingSummary">
                <h2>Booking Summary</h2>
                <div className="summary">
                    <span>
                        <h3>Event</h3>
                        <p>{booking?.event}</p>
                    </span>
                    <span>
                        <h3>Amount</h3>
                        <p>₹{booking?.price}</p>
                    </span>
                    <span>
                        <h3>Status</h3>
                        <p>{booking?.status}</p>
                    </span>
                    <span>
                        <h3>Booked On</h3>
                        <p>{booking?.bookedOn}</p>
                    </span>
                </div>
            </div>

            <form onSubmit={(e) => {
                e.preventDefault()
                onsubmit(booking)
            }} className="editSection">
                <span>
                    <label htmlFor="date">Event Date</label>
                    <input type="date" min={today} onChange={handleChange} value={booking?.date} name='date' id="date" />
                </span>
                <span>
                    <label htmlFor="time">Event Time</label>
                    <input type="time" onChange={handleChange} value={booking?.time} name='time' id="time" />
                </span>
                <span>
                    <label htmlFor="phone">Phone Number</label>
                    <input type="text" inputMode="numeric"
                        pattern="[0-9]*" onChange={handleChange} value={booking?.phone} name='phone' minLength={10} id="phone" />
                </span>

                <span>
                    <label htmlFor="street">Address Line (H.No, Building, Street)</label>
                    <input type="text" onChange={handleChange} value={booking?.address?.street} name='street' id="street" />
                </span>
                <span>
                    <label htmlFor="city">Area/Colony/Society and City</label>
                    <input type="text" onChange={handleChange} value={booking?.address?.city} name='city' id="city" />
                </span>
                <span>
                    <label htmlFor="state">State</label>
                    <input type="text" onChange={handleChange} value={booking?.address?.state} name='state' id="state" />
                </span>
                <span>
                    <label htmlFor="pincode">pincode</label>
                    <input type="number" onChange={handleChange} value={booking?.address?.pincode} name='pincode' id="pincode" />
                </span>

                <div className="buttons">
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={handleDelete}>Delete Booking</button>
                </div>
            </form>

        </div>
    )
}

export default EditBooking
