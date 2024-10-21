import React from "react";
import Leftside from "../components/Leftsidebar/Leftside";
import Navbar from "../components/Navbar/navbar";
import Missions_main_body from "../components/mainbody_missions/missionsmainbody";
import { AuthProvider } from '../context/auth_context';  // Add this

/* output function for the main body section of the app for bites and missions */

function Missions (){
    return(
        <AuthProvider>
          <Leftside/>
          <Navbar/>  
          <Missions_main_body/>   
                                             
          </AuthProvider>        
        
    )
}
export default Missions