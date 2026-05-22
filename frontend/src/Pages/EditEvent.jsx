import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { AuthContext } from "../context/AuthContext"

const EditEvent = () => {

    const { eventId } = useParams()

    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    if (!user) navigate("/login")

    const [event, setEvent] = useState({
        title: "",
        category: "DJ",
        price: "",
        desc: "",
        availability: "",
        image: null
    })

    const fetchEventDetails = async () => {
        const res = await fetch(`https://bookmyvibepro.onrender.com/api/vendor/event/${eventId}`, {
            credentials: "include"
        })
        const result = await res.json()
        setEvent(result.event)
    }

    useEffect(() => {
        fetchEventDetails()
    }, [])

    const handleChange = (e) => {
        const { name, value, files } = e.target

        setEvent(prev => ({
            ...prev,
            [name]: files ? files : value
        }))
    }

    const handleSubmit = async (data) => {
        const formData = new FormData()

        formData.append("title", data.title)
        formData.append("category", data.category)
        formData.append("price", data.price)
        formData.append("desc", data.desc)
        formData.append("availability", data.availability)
        if (data.image) {
            formData.append("image", data.image[0])
        }

        const res = await fetch(`https://bookmyvibepro.onrender.com/api/vendor/events/${eventId}`, {
            credentials: "include",
            method: "PATCH",
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
            <form className='event-form' onSubmit={(e) => {
                e.preventDefault()
                handleSubmit(event)
            }}>
                <h1>Edit Event/Service</h1>
                <div className="input-field">
                    <label htmlFor="title">Service Title</label>
                    <input type="text" name='title' onChange={handleChange} id="title" value={event?.title} required />
                </div>
                <div className="input-field">
                    <label htmlFor="catetgory">Catetgory</label>
                    <select name='category' onChange={handleChange} value={event?.category} >
                        <option value="DJ">DJ</option>
                        <option value="Decorator">Decorator</option>
                        <option value="Food">Food</option>
                        <option value="Lightening">Lightening</option>
                    </select>
                </div>
                <div className="input-field">
                    <label htmlFor="price">Price (₹)</label>
                    <input type="number" name='price' onChange={handleChange} value={event?.price} id="price" required />
                </div>
                <div className="input-field">
                    <label htmlFor="desc">Description</label>
                    <input type="text" name='desc' onChange={handleChange} value={event?.desc} id="desc" required />
                </div>
                <div className="input-field">
                    <label htmlFor="availability">Availabiltiy / Timing</label>
                    <input type="text" name='availability' onChange={handleChange} value={event?.availability} id="availability" placeholder='e.g. Weekends, Mon - Fri, 9am - 11pm' required />
                </div>
                <div className="input-field">
                    <label htmlFor="image">Upload Image</label>
                    <input type="file" name='image' id="image" accept="image/*" />
                </div>
                <div className="buttons">
                    <button type="submit" >Save Changes</button>
                    <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                </div>
            </form>
        </div>
    )
}

export default EditEvent
