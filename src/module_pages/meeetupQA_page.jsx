import React from "react"
import Leftside from '../components/Leftsidebar/Leftside'
import Navbar from '../components/Navbar/navbar'
import MeetupQA from '../components/MeetupQA';  

import { useAuth } from '../context/auth_context';  // Add this

function MeetupQApage() {
  const { user, isAuthenticated, loading } = useAuth();
  
  console.log("Auth in MeetupQApage:", { user, isAuthenticated, loading });
    return (
    <div>
      <Leftside />
      <Navbar />
      <MeetupQA />
     
     
    </div>
  )
}
export default MeetupQApage