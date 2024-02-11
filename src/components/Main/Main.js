import React from 'react'
import { Link } from 'react-router-dom'
// import './main.css'

const Main = () => {
  return (
    <div className='mai'>
      <div>
        <Link className='styled-link' to='/client'>Client</Link>
        </div>
        <div>
        <Link className='styled-link' to="/Vendor">Vendor</Link>
        </div>
        <div>
        <Link className='styled-link' to="/adminlogin">Admin</Link>
        </div>
    </div>
  )
}

export default Main