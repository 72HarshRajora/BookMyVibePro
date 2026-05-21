import { useState, useEffect, createContext } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [darkTheme, setDarkTheme] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('bmv-user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])


    const login = (userData) => {
        setUser(userData)
        localStorage.setItem('bmv-user', JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('bmv-user')
    }

    return (
        <AuthContext.Provider value={{ darkTheme, setDarkTheme, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}