import React from 'react';
import Leftside from '../components/Leftsidebar/Leftside'
import Navbar from '../components/Navbar/navbar'
import Sign_in_main_body from '../components/registar/sign_in_main';
import { Helmet } from "react-helmet-async";

function Register() {
    return (
    <>
     <Helmet>
            <title>A Block of Crypto Login</title>
            <meta name="description" content="Learn Web3, blockchain, Crypto, DeFi, DAO's, dApps with our free courses" />
            <meta name="keywords" content="Web3, learn, crypto, education, blockchain" />
            <meta property="og:title" content="Learn Web3 - Free" />
            <meta property="og:description" content="Unlock Missions to gain experience in Web3 topics, crypto, and decentralized technologies." />
            <meta property="og:image" content="https://s3.us-east-1.amazonaws.com/contents.newzenler.com/24209/library/66977603877a8_1721202179_greenlogo.png" />
            <meta property="og:url" content="https://app.ablockofcrypto.com/bytes" />
            <meta name="twitter:card" content="https://s3.us-east-1.amazonaws.com/contents.newzenler.com/24209/library/66977603877a8_1721202179_greenlogo.png" />
        </Helmet>
    <Leftside />
    <Navbar />
    <Sign_in_main_body />
    
    </>)
}

export default Register;
