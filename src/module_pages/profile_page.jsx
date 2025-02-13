import React from 'react';
import Leftside from '../components/Leftsidebar/Leftside'
import Navbar from '../components/Navbar/navbar'
import Profile_main_body from '../components/mainbody_profile/profilemainbody';
import { Helmet } from "react-helmet-async";

function Profile() {
    return (
        <>
          <Leftside />
          <Navbar />
          <Profile_main_body />


          </>)
}

export default Profile;
