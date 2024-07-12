import React from "react";
import Close_sidebar_btn from "./close_leftside_btn";
import Menu_items from "./menu_items";
import Adminupdate from "./updates_container";


/*this is the left nav bar shown on all app screens */
function Leftside (){
    return(
        <div >
             <div className="container" >
                 <nav className="container__left-sidebar" id="sidebar">
                    <Close_sidebar_btn />
                    <Menu_items />
                    <Adminupdate />                       
                        
                 </nav>
                </div>
        </div>
    )
}

export default Leftside