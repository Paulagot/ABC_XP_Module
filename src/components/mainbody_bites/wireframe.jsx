
import './MissionCardWireFrame.css';
import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/auth_context"


const MissionCardWireframe = ({ item = [] }) => {
    const { user, zenlerToken } = useAuth();
    const [userBytesData, setUserBytesData] = useState([]);
    const userId = user?.user_id;

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:3000/api/user_bytes?user_id=${userId}`)
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

    const handleByteClick = (courseUrl) => {
        const zenlerLoggedIn = sessionStorage.getItem("zenlerLoggedIn");
        console.log("Zenler Logged In (from sessionStorage):", zenlerLoggedIn); // This should persist as "true" after the first SSO redirect
    
        // Check if zenlerToken is available
        if (!zenlerToken) {
            console.log("Zenler token is not available. Cannot proceed with SSO or course access.");
            alert("Please log in to access this course."); // Show a message to prompt login
            return;
        }
    
        if (!zenlerLoggedIn) {
            console.log("Redirecting to Zenler SSO endpoint for login.");
    
            const errorUrl = "https://www.ablockofcrypto.com/blog";
            const ssoUrl = `https://ABlockofCrypto.newzenler.com/api/sso/v1?token=${zenlerToken}&return_to=${encodeURIComponent(courseUrl)}&error_url=${encodeURIComponent(errorUrl)}`;
    
            console.log("Zenler SSO URL:", ssoUrl);
            window.open(ssoUrl, "_blank"); // Open SSO link in a new tab
            sessionStorage.setItem("zenlerLoggedIn", "true"); // Set Zenler login state in sessionStorage after first redirect
        } else {
            console.log("User already logged into Zenler; redirecting directly to course.");
            window.open(courseUrl, "_blank"); // Directly open course URL in a new tab if already logged in
        }
    };
    
    
    

    return (
        <div className='container_bites'>
            {sortedData.map((val) => {
                console.log("Course data:", val); // Logs each val to check byte_link presence
                return (
                    <div 
                        key={val.course_id || `${val.name}-${val.category}-${val.subcategory}`} 
                        className={`outer-container ${val.className}`}
                        onClick={() => handleByteClick(val.url)}
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
                            <div className="sponsor-section">
                                <p className="sponsor-text">Thanks to our Sponsor</p>
                                <div className="sponsor-logo">
                                    <img className='slogo' src={val.sponsor_img} alt="sponsor-logo" />
                                </div>
                            </div>

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

