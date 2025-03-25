import React from "react"
import Leftside from '../components/Leftsidebar/Leftside'
import Navbar from '../components/Navbar/navbar'
import Earn from '../components/Earn/earn'

import { AuthProvider } from '../context/auth_context';  // Add this

function Earnpage() {
    return (
    <div>
      <Leftside />
      <Navbar />
      <Earn />  
     
    </div>
  )
}
export default Earnpage