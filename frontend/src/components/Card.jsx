import React from 'react'
import "../styles/Card.css"
import { NavLink } from "react-router-dom"

const Card = (props) => {
    return (
        <div className='card'>
            <img src={props.img} alt="Img Here" />
            <div className="details">
                <div className="upper">
                    <h3>{props.category}</h3>
                    <p>{props.availability}</p>
                </div>
                <div className="middle">
                    <h2>{props.title}</h2>
                    <p>By {props.vendor}</p>
                </div>
                <hr></hr>
                <div className="lower">
                    <p>₹{props.price}</p>
                    <NavLink to={`/events/${props.eventId}`}>View Details</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Card
