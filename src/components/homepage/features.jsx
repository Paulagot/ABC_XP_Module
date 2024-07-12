import React from "react";

function Features (){
    return (<div className="features-container" id="features">
        <h3 className="features-text-header">Features</h3>
        <div className="cards-container">
            <div className="card">
                <img src="https://img.icons8.com/clouds/100/book-philosophy.png" alt="Categories Icon" className="card_icon-placeholder"/>
                <p className="card-header">Learn</p>
                <p className="card-description-text">Level up your Web3 Knowledge with our Crypto Bites created by industry experts.  Earn Learning Points (LP) on the way and climb that leaderboard!</p>
            </div>
        
            <div className="card">
                <img src="https://img.icons8.com/clouds/100/rocket.png" alt="Tracks Icon" className="card_icon-placeholder"/>
                <p className="card-header">Unlock Missions</p>
                <p className="card-description-text">Grow your LP and unlock Missions to put your knowlege into action.  Complete the mission to claim eXperience Points. </p>
            </div>
        </div>
        <div className="cards-container">
            <div className="card">
                 <img src="https://secure.meetupstatic.com/photos/event/d/c/2/5/600_498356357.webp" alt="meetup-logo" className="meetup-logo"/>
                <p className="card-header">Attend Meetups</p>
                <p className="card-description-text">Expand your network, share knowledge and chat about all things web3 and crypto.  Weekly meetups are held online. Everyone is welcome. </p>
            </div>
            <div className="card">
                <img src="https://secure.meetupstatic.com/photos/event/d/c/2/5/600_498356357.webp" alt="meetup-logo" className="meetup-logo"/>
                <p className="card-header">Earn Rewards</p>
                <p className="card-description-text">Expand your network, share knowledge and chat about all things web3 and crypto.  Weekly meetups are held online. Everyone is welcome. </p>
            </div>
        </div>
    </div>)
}

export default Features