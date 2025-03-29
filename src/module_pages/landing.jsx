import React from "react"
import Leftside from '../components/Leftsidebar/Leftside'
import Navbar from '../components/Navbar/navbar'
import LandingPage from "../components/landing_pages/landingpages";

import { AuthProvider } from '../context/auth_context';  // Add this

function Landing() {
    return (
    <div>
      <Leftside />
      <Navbar />
      <LandingPage /> 
     
    </div>
  )
}
export default Landing