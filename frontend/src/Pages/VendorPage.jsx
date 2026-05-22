import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import "../styles/VendorPage.css"

const VendorPage = () => {
    const { vendorId } = useParams()
    const [vendor, setVendor] = useState(null)
    const [eventList, setEventList] = useState([])

    useEffect(() => {
        (async () => {
            const res = await fetch(`https://bookmyvibepro.onrender.com/api/events/vendor/${vendorId}`, {
                credentials: "include"
            })
            const result = await res.json()
            setVendor(result.vendor)
            setEventList(result.events)
        })()
    }, [])


    return (
        <div className='vendorPage'>
            <div className="heading">
                <h1>Vendor: {vendor?.name}</h1>
                <span>
                    <p>{vendor?.isVerified ? "Verified" : "Not Verified"}</p>
                    <p>Joined {vendor?.created_on?.split("T")[0]}</p>
                </span>
            </div>
            <div className="main">
                <div className="table-content">
                    <table>
                        <thead>
                            <tr>
                                <th>Event</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Availability</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {eventList.map(event => {
                                return (
                                    <tr>
                                        <td>{event.title}</td>
                                        <td>{event.category}</td>
                                        <td>{event.price}</td>
                                        <td>{event.availability}</td>
                                        <td><NavLink to={`/events/${event._id}`}>View Details</NavLink></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default VendorPage
