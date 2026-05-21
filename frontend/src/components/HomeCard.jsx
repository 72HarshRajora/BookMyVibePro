import React from 'react'
import "../styles/HomeCard.css"

const HomeCard = (props) => {
  return (
    <div className='home-card'>
      <span>{props.icon}</span>
      <h2>{props.heading}</h2>
      <p>{props.desc}</p>
    </div>
  )
}

export default HomeCard
