import React from "react";

function Partners (){
    return (<div className="partners-container" id="partners">
        <h3 className="partner-text-header">Partners</h3>
        <div className="partner-members-container">
            <div className="partner-member">
                <img className="partner-image" src="src/assets/hive.png" alt="partner" />
            </div>
            <div className="partner-member">
                <img className="partner-image" src="src/assets/solana.jpg" alt="partner" />
            
            </div>
            <div className="partner-member">
                <img className="partner-image" src="src/assets/splinterlands.jpeg" alt="partner" />
                
            </div>
        </div>       
    </div>)
}

export default Partners