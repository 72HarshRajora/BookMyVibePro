import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import "../styles/Navbar.css"
import { Moon, Sun, Menu, X } from "lucide-react"
import { NavLink } from "react-router-dom"
import toast from 'react-hot-toast'

const Navbar = () => {
    const { darkTheme, setDarkTheme, user, logout } = useContext(AuthContext)
    const [menuOpen, setMenuOpen] = useState(false)

    const handleLogout = async () => {
        const res = await fetch("http://localhost:3000/api/auth/logout", {
            method: "POST",
            credentials: "include"
        })
        const result = await res.json()

        logout()
        toast.success(result.message)
    }

    const closeMenu = () => setMenuOpen(false)

    return (
        <div>
            <nav className={`navbar ${darkTheme ? "dark" : ""}`}>
                <div className={`logo-section ${darkTheme ? "bg-white" : ""}`}>
                    <NavLink to="/">
                        <img src="/B-logo.png" alt="Logo Here" />
                        <img src="/TextLogo.png" alt="Logo Here" />
                    </NavLink>
                </div>
                <div className={`side-menu ${menuOpen ? "open" : ""}`}>
                    <button type="button" className='Hamburger' onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
                    <ul>
                        <li><NavLink to="/events" className={(e) => { return e.isActive ? "active" : "" }} onClick={closeMenu}>Explore Events</NavLink></li>
                        {
                            user ? (
                                <>
                                    {user.role === 'user' && (
                                        <li><NavLink to="/user-profile" className={(e) => { return e.isActive ? "active" : "" }} onClick={closeMenu}>Profile</NavLink></li>
                                    )}
                                    {user.role === 'vendor' && (
                                        <li><NavLink to="/vendor-dashboard" className={(e) => { return e.isActive ? "active" : "" }} onClick={closeMenu}>Dashboard</NavLink></li>
                                    )}
                                    {user.role === 'admin' && (
                                        <li><NavLink to="/admin-dashboard" className={(e) => { return e.isActive ? "active" : "" }} onClick={closeMenu}>Dashboard</NavLink></li>
                                    )}
                                </>
                            )
                                : <li><NavLink to="/login" className={(e) => { return e.isActive ? "active" : "" }} onClick={closeMenu}>Login</NavLink></li>
                        }
                        {
                            user ? <li><NavLink to="/" onClick={()=>{
                                handleLogout(),
                                closeMenu()
                            }} className={(e) => { return e.isActive ? "active" : "" }}>Logout</NavLink></li>
                                : <li><NavLink to="/register" className={(e) => { return e.isActive ? "active" : "" }} onClick={closeMenu}>Signup</NavLink></li>
                        }
                        <li><button onClick={() => {
                            setDarkTheme(!darkTheme)
                        }}>{darkTheme ? <Moon /> : <Sun />}</button></li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Navbar