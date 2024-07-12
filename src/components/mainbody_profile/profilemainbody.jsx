import React from "react";
import Page_header from "../pageheader";

function Profile_main_body() {  

    return (
        <main className="container__right" id="main">
                              
             {/* Render header on smaller screens */}
             <div className="show-on-small-screen">
                <Page_header />
            </div>
            
            
            
        </main>
    );
}

export default Profile_main_body;