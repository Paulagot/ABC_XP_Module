import React from 'react';
import Leftside from '../components/Leftsidebar/Leftside'
import Navbar from '../components/Navbar/navbar'
import Leaderboard_main_body from '../components/mainbody_leaderboard/leaderboardmainbody';
import { AuthProvider } from '../context/auth_context';  // Add this

function Leaderboard() {
    return (
        <AuthProvider>
        <Leftside />
         <Navbar />
         <Leaderboard_main_body />
         
        
        </AuthProvider>)
    }

export default Leaderboard;
