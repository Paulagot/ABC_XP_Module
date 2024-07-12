import React from "react";
import Singin_btn from "./signin_button";
import Navbar_btn from "./navbar_btn";
import Navbar_logo from "./navbar_logo";
import Page_header from "../pageheader";


function Navbar (){
    return(
        <div className="navbar">
            <Navbar_btn />
            <Navbar_logo />
            <div className="hide-on-small-screen">
                <Page_header />
            </div>
            <Singin_btn />
        </div>        
    )
}

export default Navbar