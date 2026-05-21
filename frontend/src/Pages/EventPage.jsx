import { useContext, useEffect, useState } from 'react'
import "../styles/EventPage.css"
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import toast from "react-hot-toast"
import { useForm } from "react-hook-form"
import { AuthContext } from '../context/AuthContext'

const EventPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()

    const { eventId } = useParams()
    const [event, setEvent] = useState(null)
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)

    const onSubmit = async (data) => {
        const res = await fetch("http://localhost:3000/api/bookings/create", {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            method: "POST",
            body: JSON.stringify({
                ...data,
                eventId
            })
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
            const res = await fetch(`http://localhost:3000/api/events/get-events/${eventId}`, {
                credentials: "include"
            })
            const result = await res.json()
            setEvent(result.event)
        })()
    }, [])


    const todayDate = new Date().toISOString().split("T")[0]

    return (
        <div className='EventPage'>
            {event ? <><div className="innerdiv left">
                <div className="eventImg">
                    <img src={event.image} alt="Img Here" />
                </div>
                <div className="eventDetails">
                    <h1>{event.title}</h1>
                    <p>{event.category} • By <NavLink to={`/vendor/${event.vendor._id}`}>{event.vendor.name}</NavLink> <span>{event.availability}</span></p>
                    <h2>₹{event.price}</h2>
                    <p>{event.desc}</p>
                </div>
            </div>
                <form onSubmit={handleSubmit(onSubmit)} className="innerdiv right">
                    <h2>Book this service</h2>

                    <label htmlFor='date'>Event Date</label>
                    <input type="date" {...register("date", {required: true})} min={todayDate} id='date' />

                    <label htmlFor="time">Event Time</label>
                    <input type="time" {...register("time", {required: true})} id="time" />

                    <label htmlFor="phone">Phone Number</label>
                    <input type="number" {...register("phone", {required: true})} id="phone" />

                    <label htmlFor="street">Address Line (H.No, Building, Street)</label>
                    <input type="text" {...register("street", {required: true})} id="street" />

                    <label htmlFor="city">Area/Colony/Society and City</label>
                    <input type="text" {...register("city", {required: true})} id="city" />

                    <label htmlFor="state">State</label>
                    <input type="text" {...register("state", {required: true})} id="state" />

                    <label htmlFor="pincode">pincode</label>
                    <input type="number" {...register("pincode", {required: true})} id="pincode" />

                    <button type='submit' disabled={isSubmitting}>Confirm Booking</button>
                </form></> : <>
                <div className="innerdiv">
                    <h1>Event Not Found</h1>
                </div>
            </>}
        </div>
    )
}

export default EventPage
