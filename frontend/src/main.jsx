import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./Pages/Home.jsx"
import Events from "./Pages/Events.jsx"
import Login from "./Pages/Login.jsx"
import Signup from './Pages/Signup.jsx'
import VerifyOtp from './Pages/VerifyOtp.jsx'
import { Toaster } from "react-hot-toast"
import UserProfile from './Pages/UserProfile.jsx'
import VendorDashboard from './Pages/VendorDashboard.jsx'
import AdminDashboard from "./Pages/AdminDashboard.jsx"
import EventPage from './Pages/EventPage.jsx'
import VendorPage from './Pages/VendorPage.jsx'
import EditBooking from './Pages/EditBooking.jsx'
import AddNewEvent from './Pages/AddNewEvent.jsx'
import EditEvent from './Pages/EditEvent.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "events",
                element: <Events />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Signup />
            },
            {
                path: "verify-otp",
                element: <VerifyOtp />
            },
            {
                path: "user-profile",
                element: <UserProfile />
            },
            {
                path: "vendor-dashboard",
                element: <VendorDashboard />
            },
            {
                path: "admin-dashboard",
                element: <AdminDashboard />
            },
            {
                path: "events/:eventId",
                element: <EventPage />
            },
            {
                path: "vendor/:vendorId",
                element: <VendorPage />
            },
            {
                path: "booking/edit/:bookingId",
                element: <EditBooking />
            },
            {
                path: "vendor/create-event",
                element: <AddNewEvent />
            },
            {
                path: "vendor/edit-event/:eventId",
                element: <EditEvent />
            }
        ]
    }
])

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
    </AuthProvider>
)