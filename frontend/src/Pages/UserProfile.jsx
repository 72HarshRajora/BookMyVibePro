import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from "../context/AuthContext"
import { NavLink, useNavigate } from "react-router-dom"
import "../styles/UserProfile.css"
import toast from "react-hot-toast"

const UserProfile = () => {
  const { user } = useContext(AuthContext)

  const [userInfo, setUserInfo] = useState(null)
  const [bookings, setBookings] = useState([])
  const [view, setView] = useState(null)

  const [editing, setEditing] = useState(false);

  const navigate = useNavigate()

  const fetchUser = async () => {
    const res = await fetch("http://localhost:3000/api/users/profile", {
      credentials: "include"
    })
    if (!res.ok) navigate("/login")

    const result = await res.json()
    setUserInfo(result.user)
    setEditing(false)
  }

  useEffect(() => {
    fetchUser()

    const fetchBooking = async () => {
      const res = await fetch("http://localhost:3000/api/users/bookings", {
        credentials: "include"
      })
      const result = await res.json()
      setBookings(result.bookings)
    }
    fetchBooking()
  }, [])

  const handleSubmit = async (data) => {
    const res = await fetch(`http://localhost:3000/api/users/update-profile`, {
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

  return (
    <div className='userProfile'>
      <div className="header">
        <h2>My Profile</h2>
        <p>Welcome back, {user?.name}</p>
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

      <div className="personal">
        <h2>My Bookings</h2>
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
              {bookings.map(booking => {
                return (
                  <>
                    <tr key={booking?.id}>
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
                            <NavLink to={`/events/${booking.eventId}`} className={"event-page"}>Go to Event Page</NavLink>
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
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default UserProfile
