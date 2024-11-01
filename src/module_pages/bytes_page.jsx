import React from "react"
import Leftside from '../components/Leftsidebar/Leftside'
import Navbar from '../components/Navbar/navbar'
import Bites_main_body from "../components/mainbody_bites/bitesmainbody"
import { AuthProvider } from '../context/auth_context';  // Add this

function Bytes() {
    return (
    <AuthProvider>
      <Leftside />
      <Navbar />
      <Bites_main_body />    
     
    </AuthProvider>
  )
}
export default Bytes