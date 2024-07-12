import React from "react";

/*to do, the link, blogtitle and img should update from the DB */
function Header (){
    return( 
        <div className="nav-bar"> 
        <div className="nav-logo-container">
            <img className="nav-logo" src="public/greenlogo.png" alt="abc logo" />
        </div>
        <div className="nav-items">
            <a href="#partners">Partners</a>
            <a href="#features">Features</a>
            <a href="#team">Team</a>

        </div> 
        <div className="nav-btn-container">
            <button type="button" className="sign-in-btn">
                <h2 className="launch_app">Launch App</h2>
            </button> 
        </div>        
        
    </div>
    )}

    export default Header