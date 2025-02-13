
import './MissionCardWireFrame.css';
import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/auth_context"


const MissionCardWireframe = ({ item = [] }) => {
    const { user } = useAuth();
    const [userBytesData, setUserBytesData] = useState([]);
    const userId = user?.user_id;
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (userId) {
            fetch(`${API_BASE_URL}/api/user_bytes?user_id=${userId}`)
                .then(response => response.json())
                .then(data => setUserBytesData(data))
                .catch(err => console.error("Failed to fetch user bytes data", err));
        }
    }, [userId]);

    const getByteStatus = (biteId) => {
        if (!userId) return { text: "Explore Byte", className: "not-enrolled", order: 2 };
        const userByte = userBytesData.find(ub => ub.bite_id === biteId);

        if (userByte && userByte.start_date && !userByte.completion_date) {
            return { text: "Continue Byte", className: "started", order: 1 };
        }

        if (userByte && userByte.completion_date) {
            return { text: "Byte Complete", className: "completed", order: 3 };
        }

        return { text: "Explore Byte", className: "not-enrolled", order: 2 };
    };

    const sortedData = useMemo(() => {
        if (!item || item.length === 0) return [];
        return item.map(val => {
            const status = getByteStatus(val.bite_id);
            return { ...val, ...status };
        }).sort((a, b) => a.order - b.order);
    }, [item, userBytesData]);

    const handleByteClick = async (byte) => {
        const { url: courseUrl, landing_page_url: landingPageUrl, text: status } = byte;
    
    
        // Step 1: Handle "Explore Byte" redirect to landing page
        if (status === "Explore Byte") {
          
            window.location.href=landingPageUrl;
            return;
        }
    
        // Step 2: Handle SSO logic for logged-in users
        const zenlerLoggedIn = sessionStorage.getItem("zenlerLoggedIn");
      
    
        if (zenlerLoggedIn === "true") {
          
            window.location.href= courseUrl;
            return;
        }
    
        // Step 3: Handle SSO API request
        try {
            const response = await fetch(`${API_BASE_URL}/api/sso`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseUrl, type: "byte" }), // Added `type` field
                credentials: "include",
            });
    
            if (response.ok) {
                const { ssoUrl } = await response.json();
               
                window.location.href=ssoUrl;
    
                // Step 4: Set session storage to indicate successful login
                sessionStorage.setItem("zenlerLoggedIn", "true");
            } else {
                console.error("SSO failed:", await response.json());
            }
        } catch (error) {
            console.error("Error during SSO:", error);
        }
    };
    
    

    return (
        <div className='container_bites'>
            {sortedData.map((val) => {
             
                return (
                    <div 
                        key={val.course_id || `${val.name}-${val.category}-${val.subcategory}`} 
                        className={`outer-container ${val.className}`}
                        onClick={() => handleByteClick(val)}
                    >
                        <div className="inner-container">

                            {/* Points Section */}
                            <div className="points-section">
                                <div className="points-icon"></div>
                                <div className='hex-icon'>
                                    <div className='byte_lpoints'>{val.points}</div>
                                </div>
                            </div>

                            {/* Overlap Section */}
                            <div className="overlap-section"></div>

                            {/* Icon/Logo Section */}
                            <div className="icon-section">
                                <div className="icon-circle left-circle"></div>
                                <div className="icon-byte main-icon">
                                    <img className="Byte_icon_main" src={val.thumbnail} alt="course-img" />
                                </div>
                                <div className="icon-circle right-circle"></div>
                            </div>

                            {/* Byte title Section */}
                            <div className="Bytes-section">
                                <p className="byte-text">{val.name}</p>
                            </div>

                            {/* Sponsor Section */}
                            {val.sponsor_id && (
    <div className="sponsor-section">
        <p className="sponsor-text">Thanks to our Sponsor</p>
        <div className="sponsor-logo">
            <img className='slogo' src={val.sponsor_img} alt="sponsor-logo" />
        </div>
    </div>
)}

                            {/* Hover Content */}
                            <div className="hover_contents">
                                <p className="bytes-description">{val.subtitle}</p>
                                {val.sponsor_img && (
                                    <div className="grattude">
                                        <img src={val.sponsor_img} alt="sponsor-logo" className="hover_sponsor_logo" />
                                    </div>
                                )}
                                <div className={`byte_zenler_link ${val.className}`}>{val.text}</div>
                            </div>

                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MissionCardWireframe;

