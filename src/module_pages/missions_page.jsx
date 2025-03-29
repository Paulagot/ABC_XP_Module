import React from "react";
import Leftside from "../components/Leftsidebar/Leftside";
import Navbar from "../components/Navbar/navbar";
import Missions_main_body from "../components/mainbody_missions/missionsmainbody";
import { AuthProvider } from '../context/auth_context';  // Add this
import { Helmet } from "react-helmet-async";

/* output function for the main body section of the app for bites and missions */

function Missions (){
    return(
        <div>
          <Helmet>
            <title>Missions | Unlock Experience</title>
            <meta name="description" content="Unlock Missions to gain experience in Web3 topics, crypto, and decentralized technologies." />
            <meta name="keywords" content="Web3, Bytes, crypto, education, blockchain" />
            <meta property="og:title" content="Bytes | Learn Web3" />
            <meta property="og:description" content="Unlock Missions to gain experience in Web3 topics, crypto, and decentralized technologies." />
            <meta property="og:image" content="https://s3.us-east-1.amazonaws.com/contents.newzenler.com/24209/library/66977603877a8_1721202179_greenlogo.png" />
            <meta property="og:url" content="https://app.ablockofcrypto.com/missions" />
            <meta name="twitter:card" content="https://s3.us-east-1.amazonaws.com/contents.newzenler.com/24209/library/66977603877a8_1721202179_greenlogo.png" />
        </Helmet>
          <Leftside/>
          <Navbar/>  
          <Missions_main_body/>   
                                             
          </div>        
        
    )
}
export default Missions