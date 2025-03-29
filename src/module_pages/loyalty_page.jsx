import React from 'react';
import Leftside from '../components/Leftsidebar/Leftside'
import Navbar from '../components/Navbar/navbar'
import Loyalty_main_body from '../components/mainbody_loyalty/loyaltymainbody';
import { Helmet } from "react-helmet-async";

function Loyalty() {
    return (
    <>
    <Leftside />
    <Navbar />
    <Loyalty_main_body />
    
    </>)
}

export default Loyalty;
