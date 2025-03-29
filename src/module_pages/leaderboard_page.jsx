import React from 'react';
import Leftside from '../components/Leftsidebar/Leftside'
import Navbar from '../components/Navbar/navbar'
import Leaderboard_main_body from '../components/mainbody_leaderboard/leaderboardmainbody';
import { AuthProvider } from '../context/auth_context';  // Add this
import { Helmet } from "react-helmet-async";

function Leaderboard() {
    return (
        <div>
              <Helmet>
            <title>A Block of Crypto Learners Leaderboard</title>
            <meta name="description" content="Earn Learning Points, and Experience points and claim your place in the leaderboard" />
            <meta name="keywords" content="Web3, Bytes, crypto, education, blockchain" />
            <meta property="og:title" content="Leaderboard" />
            <meta property="og:description" content="Earn Learning Points, and Experience points and claim your place in the leaderboard." />
            <meta property="og:image" content="https://s3.us-east-1.amazonaws.com/contents.newzenler.com/24209/library/66977603877a8_1721202179_greenlogo.png" />
            <meta property="og:url" content="https://app.ablockofcrypto.com/leaderboard" />
            <meta name="twitter:card" content="https://s3.us-east-1.amazonaws.com/contents.newzenler.com/24209/library/66977603877a8_1721202179_greenlogo.png" />
        </Helmet>
        <Leftside />
         <Navbar />
         <Leaderboard_main_body />
         
        
        </div>)
    }

export default Leaderboard;
