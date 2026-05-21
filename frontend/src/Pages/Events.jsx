import {useState, useEffect} from 'react'
import "../styles/Events.css"
import Card from '../components/Card'

const Events = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const getData = async () => {
      const res = await fetch("http://localhost:3000/api/events/get-events")
      const result = await res.json()
      setEvents(result.events)
    }

    getData()
  }, [])
  

  return (
    <div>
      <div className="event-page">
        <div className="inner-nav">
          <div className="heading">
            <h1>Explore Services</h1>
          </div>
          <div className="search">
            <input type="text" placeholder='Search events...'/>
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
          {events.map(event=> {
            return <Card key={event.id} img={event.image} category={event.category} availability={event.availability} title={event.title} vendor={event.vendor} price={event.price} eventId={event.id}/>
          })}
        </div>
      </div>
    </div>
  )
}

export default Events
