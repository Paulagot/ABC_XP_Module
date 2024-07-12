import React from "react";

function Hero (){
    return (<div className="hero-container">
        <div className="hero-image-container">
            <img className="hero-image" src="src/assets/home_banner.png" alt="a block of Crypto hero image"/>
        </div>
    
        <div className ="explore-btn-container">
            <button className="explore-btn"> Learn Web3 </button>
            
        </div>
    </div>)
}

export default Hero