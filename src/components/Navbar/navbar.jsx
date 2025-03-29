import React from "react";
import Singin_btn from "./signin_button";
import Navbar_btn from "./navbar_btn";
import Navbar_logo from "./navbar_logo";
import Page_header from "./pageheader";


function Navbar (){
    return(
        <div className="navbar">
            <Navbar_btn />
            <div className="hide-on-small-screen">           
            <Navbar_logo />
            </div>
            
            <Page_header />
            
            <Singin_btn />
        </div>        
    )
}

export default Navbar