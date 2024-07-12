import React from "react";



function Teamcard (props){
    return( <div className="team-member">
        <div className="team-info-container" >                  
            <p className="team-text">{props.name}<br/> {props.title}</p>                        
            <div className = "social-col">
                <div className="social-links">
                <a href={props.linkedin}><i className="fab fa-linkedin-in"></i></a>              
                </div>
            </div>
        </div> 
        <img className="team-image" src={props.img} alt="team member" />

    </div>)
}

export default Teamcard