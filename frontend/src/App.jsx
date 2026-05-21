import { useContext } from "react"
import "./App.css"
import Navbar from './components/Navbar'
import { AuthContext } from "./context/AuthContext"
import { Outlet } from "react-router-dom"

const App = () => {
  const { darkTheme, setDarkTheme } = useContext(AuthContext)

  return (
    <div className={`app ${darkTheme ? "dark" : ""}`}>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default App
