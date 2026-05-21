import { useState, useEffect, Fragment } from 'react'
import toast from "react-hot-toast"
import { NavLink, useNavigate } from 'react-router-dom'
import "../styles/VendorDashboard.css"

const VendorDashboard = () => {
  const [userInfo, setUserInfo] = useState(null)
  const [bookings, setBookings] = useState([])
  const [recBookings, setRecBookings] = useState([])
  const [view, setView] = useState(null)
  const [viewDetails, setViewDetails] = useState(null)
  const [resProcess, setResProcess] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [editing, setEditing] = useState(false);
  const [events, setEvents] = useState([])

  const [total, setTotal] = useState({
    services: 0,
    bookings: 0,
    pendings: 0
  })

  const navigate = useNavigate()

  const fetchUser = async () => {
    const res = await fetch("https://bookmyvibepro.onrender.com/api/users/profile", {
      credentials: "include"
    })
    if (!res.ok) navigate("/login")

    const result = await res.json()
    setUserInfo(result.user)
    setEditing(false)
  }

  const fetchAllEvents = async () => {
    const res = await fetch("https://bookmyvibepro.onrender.com/api/vendor/events", {
      credentials: "include"
    })
    const result = await res.json()
    setEvents(result.events)
    setTotal(prev => ({
      ...prev,
      services: result.events.length
    }))
  }

  const fetchAllRecBookings = async () => {
    const res = await fetch("https://bookmyvibepro.onrender.com/api/vendor/bookings", {
      credentials: "include"
    })
    const result = await res.json()
    setRecBookings(result.bookings)
    setTotal(prev => ({
      ...prev,
      bookings: result.bookings.length,
      pendings: result.bookings.filter(booking => booking.status === "pending").length
    }))
  }

  const fetchBooking = async () => {
    const res = await fetch("https://bookmyvibepro.onrender.com/api/users/bookings", {
      credentials: "include"
    })
    const result = await res.json()
    setBookings(result.bookings)
  }

  useEffect(() => {
    fetchUser()
    fetchAllEvents()
    fetchAllRecBookings()
    fetchBooking()
  }, [resProcess, deletingId])

  const handleSubmit = async (data) => {
    const res = await fetch(`https://bookmyvibepro.onrender.com/api/users/update-profile`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      method: "PATCH",
      body: JSON.stringify({
        name: data.name,
        phone: data.phone
      })
    })

    const result = await res.json()
    if (!res.ok) {
      toast.error(result.message)
      return
    }
    toast.success(result.message)

    setUserInfo(result.user)
    setEditing(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleStatusChange = async (bookingId, response) => {
    setResProcess(bookingId)
    const res = await fetch(`https://bookmyvibepro.onrender.com/api/vendor/bookings/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include",
      method: "POST",
      body: JSON.stringify({
        status: response
      })
    })
    const result = await res.json()
    if (!res.ok) {
      toast.error(result.message)
      return
    }
    toast.success(result.message)
    setResProcess(null)
  }

  const handleDeleteEvent = async (eventId) => {
    setDeletingId(eventId)
    const res = await fetch(`https://bookmyvibepro.onrender.com/api/vendor/events/${eventId}`, {
      credentials: "include",
      method: "DELETE"
    })
    const result = await res.json()
    if (!res.ok) {
      toast.error(result.message)
      return
    }
    toast.success(result.message)
    setDeletingId(null)
  }

  return (
    <div className='VendorDash'>
      <div className="heading">
        <h1>Vendor Dashboard</h1>
        <NavLink to={`/vendor/create-event`}>Add New Event/Service</NavLink>
      </div>

      <div className="personal">
        <div className="heading">
          <h2>Personal Information</h2>
          <button type="button" onClick={() => setEditing(!editing)}>Edit Profile</button>
        </div>
        {editing ? <form className="editData" onSubmit={(e) => {
          e.preventDefault()
          handleSubmit(userInfo)
        }}>
          <span>
            <h3>Full Name</h3>
            <input type="text" name='name' value={userInfo?.name} onChange={handleChange} />
          </span>
          <span>
            <h3>Email</h3>
            <input type="email" name="email" value={userInfo?.email} disabled={true} />
          </span>
          <span>
            <h3>Phone</h3>
            <input type="text" inputMode="numeric"
              pattern="[0-9]*" name="phone" value={userInfo?.phone} onChange={handleChange} minLength={10} />
          </span>
          <span>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={fetchUser}>Discard</button>
          </span>
        </form> : <div className="data">
          <span>
            <h3>Full Name</h3>
            <p>{userInfo?.name}</p>
          </span>
          <span>
            <h3>Email</h3>
            <p>{userInfo?.email}</p>
          </span>
          <span>
            <h3>Phone</h3>
            <p>{userInfo?.phone}</p>
          </span>
          <span>
            <h3>Joined</h3>
            <p>{userInfo?.dateOfJoin}</p>
          </span>
        </div>}
      </div>

      <div className="display">
        <span>
          <p>Total Services</p>
          <h2>{total.services}</h2>
        </span>
        <span>
          <p>Total Bookings</p>
          <h2>{total.bookings}</h2>
        </span>
        <span>
          <p>Pending Bookings</p>
          <h2>{total.pendings}</h2>
        </span>
      </div>

      <div className="my-services">
        <h1>My Services</h1>
        <div className="service-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {(events.length > 0) ? events.map(event => {
                return (
                  <tr key={event._id}>
                    <td>{event.title}</td>
                    <td>{event.category}</td>
                    <td>{event.price}</td>
                    <td>
                      <button type="button" onClick={() => navigate(`/vendor/edit-event/${event._id}`)}>{(deletingId === event._id) ? "..." : "Edit"}</button>
                      <button type="button" onClick={() => handleDeleteEvent(event._id)}>{(deletingId === event._id) ? "..." : "Delete"}</button>
                    </td>
                  </tr>
                )
              }) : <tr>
                <td colSpan="4" className="empty">No Service Found</td>
              </tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="recent-bookings">
        <h1>Recent Bookings</h1>
        <div className="rec-bookings">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>View Details</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {(recBookings.length > 0) ? recBookings.map(booking => {
                return (
                  <Fragment key={booking.id}>
                    <tr>
                      <td>{booking.customer}</td>
                      <td>{booking.service}</td>
                      <td>{booking.date}</td>
                      <td>{booking.time}</td>
                      <td>
                        <button type="button" onClick={() => {
                          if (viewDetails === booking.id) {
                            setViewDetails(null)
                          } else {
                            setViewDetails(booking.id)
                          }
                        }}>{(viewDetails === booking.id) ? "Hide" : "View Details"}</button>
                      </td>
                      {booking.status === "pending" ? <td>
                        {(resProcess === booking.id) ? "..." : <>
                          <button type="button" onClick={() => {
                            handleStatusChange(booking.id, "confirmed")
                          }}>Confirm</button>
                          <button type="button" onClick={() => {
                            handleStatusChange(booking.id, "cancelled")
                          }}>Cancel</button>
                        </>}
                      </td> : <td>{booking.status}</td>}
                    </tr>
                    {(viewDetails === booking.id) && (
                      <tr>
                        <td colSpan="6">
                          <div className="booking-details">
                            <span>
                              <h3>Customer Email</h3>
                              <p>{booking.email}</p>
                            </span>
                            <span>
                              <h3>Phone Number</h3>
                              <p>{booking.phone}</p>
                            </span>
                            <span>
                              <h3>Event Address</h3>
                              <p>{booking.address}</p>
                            </span>
                            <span>
                              <h3>Status</h3>
                              <p>{booking.status}</p>
                            </span>
                            <span>
                              <h3>Booked On</h3>
                              <p>{booking.bookedOn}</p>
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              }) : <tr>
                <td colSpan="6" className="empty">No Booking Received</td>
              </tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="personal">
        <h1>My Bookings</h1>
        <div className="bookings">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Event Date</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(bookings.length > 0) ? bookings.map(booking => {
                return (
                  <Fragment key={booking.id}>
                    <tr>
                      <td>{booking?.event}</td>
                      <td>{new Date(booking?.date).toLocaleDateString("en-IN")}</td>
                      <td>{booking?.time}</td>
                      <td>{booking?.price}</td>
                      <td>{booking?.status}</td>
                      <td><button type="button" onClick={() => {
                        setView(view === booking.id ? null : booking.id)
                      }}>{view === booking.id ? "Hide" : "View Details"}</button></td>
                    </tr>
                    {view === booking.id && (
                      <tr className="details-row">
                        <td colSpan="6">
                          <div className="details-wrapper">
                            <div className="details">
                              <p>Phone</p>
                              <p>{booking.phone}</p>
                            </div>
                            <div className="details">
                              <p>Address</p>
                              <p>{booking.address}</p>
                            </div>
                            <div className="details">
                              <p>Booked On</p>
                              <p>{booking.bookedOn}</p>
                            </div>
                          </div>
                          <div className="buttons">
                            <NavLink to={`/events/${booking.eventId}`}>Go to Event Page</NavLink>
                            {(() => {
                              const eventDateTime = new Date(booking.date);
                              if (booking.time) {
                                const [h, m] = booking.time.split(':');
                                eventDateTime.setHours(parseInt(h), parseInt(m), 0, 0);
                              }
                              const hoursLeft = (eventDateTime - new Date()) / (1000 * 60 * 60);
                              const canEdit = hoursLeft >= 24;

                              return canEdit ? (
                                <NavLink to={`/booking/edit/${booking.id}`} className={"edit-btn"}>
                                  Edit Booking
                                </NavLink>
                              ) : (
                                <button type='button' disabled>
                                  Edit Locked
                                </button>
                              );
                            })()}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              }) : <tr>
                <td colSpan="6" className="empty">No Bookings Created</td>
              </tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default VendorDashboard