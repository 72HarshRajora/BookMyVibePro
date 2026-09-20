import {useState, useEffect} from 'react'
import "../styles/Events.css"
import Card from '../components/Card'

const Events = () => {
  const [events, setEvents] = useState([])
  const [filterEvents, setFilterEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const getData = async () => {
        try {
          const res = await fetch("https://bookmyvibepro.onrender.com/api/events/get-events")

          if (!res.ok) {
            throw new Error("Failed to fetch events")
          }
          const result = await res.json()
          setEvents(result.events || [])
          setFilterEvents(result.events || [])
        } catch (err) {
          setError(err.message)
        } finally {
          setIsLoading(false)
        }
      }
      getData()
  }, [])

  const handleSearch = (e) => {
    const search = e.target.value
    if(search === "") {
      setFilterEvents(events)
      return
    }
    const searchResult = events.filter(event => {
      return event.title.toLowerCase().includes(search.toLowerCase())
    })
    setFilterEvents(searchResult)
  }
  
  return (
    <div>
      <div className="event-page">
        <div className="inner-nav">
          <div className="heading">
            <h1>Explore Services</h1>
          </div>
          <div className="search">
            <input type="text" placeholder='Search events...' onChange={handleSearch}/>
            <select name="category">
              <option value="All Categories">All Categories</option>
              <option value="DJ">DJ</option>
              <option value="Decorator">Decorator</option>
              <option value="Food">Food</option>
              <option value="Lightening">Lightening</option>
            </select>
          </div>
        </div>

        <div className="event-cards">
          {isLoading ? (
            <h2>Loading...</h2>
          ) : error ? (
            <h2>{error}</h2>
          ) : filterEvents.length > 0 ? (
            filterEvents.map(event=> {
              return <Card key={event.id} img={event.image} category={event.category} availability={event.availability} title={event.title} vendor={event.vendor} price={event.price} eventId={event.id}/>
            })
          ) : (
            <h2>No events found</h2>
          )}
        </div>
      </div>
    </div>
  )
}

export default Events
