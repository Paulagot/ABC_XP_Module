import React, { useState } from "react";

function Bites_Cards({ item = [] }) {
    return (
        <div className="container_bites">
            {item.map((val) => (
                <div 
                    key={val.course_id} 
                    className="byte_container_content"
                    onMouseEnter={(e) => e.currentTarget.querySelector('.hover_content').style.display = 'block'}
                    onMouseLeave={(e) => e.currentTarget.querySelector('.hover_content').style.display = 'none'}
                >
                    <div className="byte_card_content">
                        <a className="byte_link" href={val.url} target="_blank" rel="noreferrer">
                            <div className="byte_card">
                                <img src={val.thumbnail} alt="course-img" className="byte_img" />
                                <div className="top_content">
                                    {val.sponsor_img && val.sponsor_img.trim() !== '' && (
                                        <div className="byte-sponsor-logo-container">
                                            <img src={val.sponsor_img} alt="sponsor-logo" className="byte-sponsor-logo" />
                                        </div>
                                    )}
                                   
                                </div>
                                <div className="lower_content">
                                    <p className="byte-name">{val.name}</p>
                                    <div className="byte_points_container">
                                        <p className="byte_points">LP: {val.points}</p>
                                    </div>
                                </div>
                            </div>
                        
                        {/* Hover content */}
                        <div className="hover_content">
                            <p className="byte-description">{val.subtitle}</p>
                            {val.sponsor_img && (
                                <div className="hover_sponsor">
                                    <p>Thanks to our Sponsor {val.sponsor_name}</p>
                                    <img src={val.sponsor_img} alt="sponsor-logo" className="hover_sponsor_logo" />
                                </div>
                            )}
                            <div className="byte-user_status">START</div>
                        </div>
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Bites_Cards;


