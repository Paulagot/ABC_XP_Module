import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/auth_context"; // Import useAuth to access authentication context, including user data and JWT token


function Bites_Cards({ item = [] }) {
    const { user, zenlerToken } = useAuth(); // Use auth context for user and Zenler token
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

    // Function to determine the status of each byte (Explore, Continue, Complete) based on progress data
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

    // Event handler to manage Zenler SSO and course redirection
    const handleByteClick = (courseUrl) => {
        // Check if user is already logged into Zenler using sessionStorage
        const zenlerLoggedIn = sessionStorage.getItem("zenlerLoggedIn");
    
        if (!zenlerLoggedIn && zenlerToken) { // Redirect to SSO only if not logged in
            console.log("Redirecting to Zenler SSO endpoint for login.");
    
            const errorUrl = "https://www.ablockofcrypto.com/blog";
            const ssoUrl = `https://ABlockofCrypto.newzenler.com/api/sso/v1?token=${zenlerToken}&return_to=${encodeURIComponent(courseUrl)}&error_url=${encodeURIComponent(errorUrl)}`;
    
            console.log("Zenler SSO URL:", ssoUrl);
            window.open(ssoUrl, "_blank"); // Open SSO link in the same tab
            sessionStorage.setItem("zenlerLoggedIn", "true"); // Set Zenler login state in sessionStorage after first redirect
        } else {
            console.log("User already logged into Zenler; redirecting directly to course.");
            window.open(courseUrl, "_blank") // Directly open course URL in the same tab if already logged in
        }
    };
    

    return (
        <div className="container_bites">
           
            {sortedData.map((val) => (
                 
                <div
                    key={val.course_id || `${val.name}-${val.category}-${val.subcategory}`}
                    className="byte_container_content"
                    onMouseEnter={(e) => e.currentTarget.querySelector('.hover_content').style.display = 'block'}
                    onMouseLeave={(e) => e.currentTarget.querySelector('.hover_content').style.display = 'none'}
                >
                   
                    <div className="byte_card_content" style={{ position: 'relative' }}>
                       
                        <a
                            className="byte_link"
                            onClick={(e) => {
                                e.preventDefault();
                                handleByteClick(val.url);
                            }}
                            href="#"
                            rel="noreferrer"
                        >
                            <div className={`byte_card ${val.className}`}>
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
                            <div className="hover_content">
                                <p className="byte-description">{val.subtitle}</p>
                                {val.sponsor_img && (
                                    <div className="hover_sponsor">
                                        <p>Thanks to our Sponsor {val.sponsor_name}</p>
                                        <img src={val.sponsor_img} alt="sponsor-logo" className="hover_sponsor_logo" />
                                    </div>
                                )}
                                <div className={`byte-user_status ${val.className}`}>{val.text}</div>
                            </div>
                        </a>
                   
                    </div>
                    
                </div>
            ))}
        </div>
    );
}

export default Bites_Cards;
