import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import "../styles/Home.css"
import { AuthContext } from '../context/AuthContext'
import HomeCard from '../components/HomeCard'
import { UserRoundSearch, Lock, Star } from "lucide-react"

const Home = () => {
  const { darkTheme } = useContext(AuthContext)

  return (
    <div>
      <main className='upper-section'>
        <h1>Book Your Perfect <span>Vibe</span></h1>
        <p>Discover and book the best vendors for your events. From DJs to Decorators, we bring your vision to life.</p>
        <div className="buttons">
          <NavLink to="/events" className={darkTheme ? "dark" : ""}>Explore Events</NavLink>
          <NavLink to="/register" className={darkTheme ? "dark" : ""}>Become a Vendor</NavLink>
        </div>
      </main>
      <div className="home-cards">
        <HomeCard icon={<UserRoundSearch size={80} color='rgb(124, 58, 237)'/>} heading="Diverse Vendors" desc="Find exactly what you need from our wide range of curated event service providers." />
        <HomeCard icon={<Lock size={80} color='rgb(124, 58, 237)'/>} heading="Secure Booking" desc="Easy and secure booking process with instant confirmations and seamless communication." />
        <HomeCard icon={<Star size={80} fill="rgb(124, 58, 237)" color='rgb(124, 58, 237)'/>} heading="Verified Reviews" desc="Make informed decisions based on genuine reviews from previous customers." />
      </div>
    </div>
  )
}

export default Home
