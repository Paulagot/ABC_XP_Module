import React from 'react';
import './MissionCardWireFrame.css';



const MissionCardWireframe = () => {
    return (
        <div className='mainouttercontainer'>
        <div className="outer-container">
            <div className="inner-container">
                {/* Title Scroll/Banner */}
                <div className="title-banner">
                    <h2 className="title-text">Mission Card Title broken over two lines
                    <br></br>mayebe even 3</h2>
                </div>

                {/* Icon/Logo Section */}
                <div className="icon-section">
                    <div className="icon-circle left-circle">Logo</div>
                    <div className="icon-square main-icon">Main</div>
                    <div className="icon-circle right-circle">Sponsor</div>
                </div>

                {/* Sponsor Section */}
                <div className="sponsor-section">
                    <p className="sponsor-text">Thanks to our Sponsor</p>
                    <div className="sponsor-logo">Sponsor Logo</div>
                </div>

                {/* Points Section */}
                <div className="points-section">
                    <div className="points-icon">🏆</div>
                    <p className="points-text">500 Points</p>
                </div>
            </div>
        </div>
        </div>
        
    );
};

export default MissionCardWireframe;
