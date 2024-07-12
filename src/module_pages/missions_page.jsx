import React from "react";
import Leftside from "../components/Leftsidebar/Leftside";
import Navbar from "../components/Navbar/navbar";
import Missions_main_body from "../components/mainbody_missions/missionsmainbody";


/* output function for the main body section of the app for bites and missions */

function Missions (){
    return(
        <>
          <Leftside/>
          <Navbar/>  
          <Missions_main_body/>   
                                             
          </>        
        
    )
}
export default Missions