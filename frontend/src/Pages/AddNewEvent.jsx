import {useContext} from 'react'
import "../styles/AddNewEvent.css"
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { AuthContext } from "../context/AuthContext"

const AddNewEvent = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()

    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    if(!user) navigate("/login")

    const onSubmit = async (data) => {
        const formData = new FormData()

        formData.append("title", data.title)
        formData.append("category", data.category)
        formData.append("price", data.price)
        formData.append("desc", data.desc)
        formData.append("availability", data.availability)
        formData.append("image", data.image[0])

        const res = await fetch("https://bookmyvibepro.onrender.com/api/vendor/events", {
            method: "POST",
            credentials: "include",
            body: formData
        })

        const result = await res.json()

        if (!res.ok) {
            toast.error(result.message)
            return
        }
        toast.success(result.message)
        navigate("/vendor-dashboard")
    }

    return (
        <div className='AddNewEvent'>
            <form className='event-form' onSubmit={handleSubmit(onSubmit)}>
                <h1>Add New Event/Service</h1>
                <div className="input-field">
                    <label htmlFor="title">Service Title</label>
                    <input type="text" {...register("title")} id="title" required />
                </div>
                <div className="input-field">
                    <label htmlFor="catetgory">Catetgory</label>
                    <select {...register("category")} >
                        <option value="DJ">DJ</option>
                        <option value="Decorator">Decorator</option>
                        <option value="Food">Food</option>
                        <option value="Lightening">Lightening</option>
                    </select>
                </div>
                <div className="input-field">
                    <label htmlFor="price">Price (₹)</label>
                    <input type="number" {...register("price")} id="price" required />
                </div>
                <div className="input-field">
                    <label htmlFor="desc">Description</label>
                    <input type="text" {...register("desc")} id="desc" required />
                </div>
                <div className="input-field">
                    <label htmlFor="availability">Availabiltiy / Timing</label>
                    <input type="text" {...register("availability")} id="availability" placeholder='e.g. Weekends, Mon - Fri, 9am - 11pm' required />
                </div>
                <div className="input-field">
                    <label htmlFor="image">Upload Image</label>
                    <input type="file" {...register("image")} id="image" accept="image/*" required />
                </div>
                <div className="buttons">
                    <button type="submit" disabled={isSubmitting}>{isSubmitting ? "..." : "Create Service"}</button>
                    <button type="button" onClick={() => navigate(-1)} disabled={isSubmitting}>{isSubmitting ? "..." : "Cancel"}</button>
                </div>
            </form>
        </div>
    )
}

export default AddNewEvent
