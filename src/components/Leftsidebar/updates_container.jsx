import React from "react";
import Blog from "./blog_update"
import Meetup from "./meetup_update";


function Adminupdate (){
    return(     
        <div className="container-sidebar_admin">  
        <Meetup /> 
         <Blog />
                    
         </div>                                
        )
}

export default Adminupdate