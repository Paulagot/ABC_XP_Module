import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/auth_context";


function Bites_Cards({ item = [] }) {
    const { user } = useAuth();  // Access session user data

    const [userBytesData, setUserBytesData] = useState([]);
    const userId = user?.user_id;  // Get user ID from the session context

    console.log('Incoming item data:', item); // Log the incoming item data

    useEffect(() => {
        if (userId) {
            // Fetch user bytes data for the logged-in user
            fetch(`http://16.171.3.129:3000/api/user_bytes?user_id=${userId}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched user bytes data:', data); // Log the fetched data
                    if (data && data.length > 0) {
                        setUserBytesData(data); // Set the entire data as user bytes data
                    } else {
                        console.error('Unexpected API response format:', data); // Log unexpected formats
                    }
                })
                .catch(err => console.error("Failed to fetch user bytes data", err));
        }
    }, [userId]);

    // Function to determine the byte status for each item
    const getByteStatus = (biteId) => {
        if (!userId) return { text: "Explore Byte", className: "not-enrolled", order: 2 }; // No user logged in
    
        const userByte = userBytesData.find(ub => ub.bite_id === biteId);
    
        console.log('Checking byte status for biteId:', biteId, 'User Byte:', userByte); // Log for debugging
    
        if (userByte && userByte.start_date && !userByte.completion_date) {
            return { text: "Continue Byte", className: "started", order: 1 }; // Started but not completed
        }
    
        if (userByte && userByte.completion_date) {
            return { text: "Byte Complete", className: "completed", order: 3 }; // Completed
        }
    
        return { text: "Explore Byte", className: "not-enrolled", order: 2 }; // Not enrolled
    };
    

    // Apply sorting logic before rendering
    const sortedData = useMemo(() => {
        if (!item || item.length === 0) {
            console.warn('No item data available to sort:', item); // Log if no data to display
            return [];
        }
    
        // Log each item and its corresponding status
        const mappedData = item.map(val => {
            const status = getByteStatus(val.bite_id); // Determine status
            console.log('Byte ID:', val.bite_id, 'Status:', status); // Log to check status
            return { ...val, ...status }; // Combine status info with the card data
        });
    
        console.log('Mapped data before sorting:', mappedData); // Log the complete mapped data before sorting
    
        return mappedData.sort((a, b) => a.order - b.order); // Sort by the 'order' field
    }, [item, userBytesData]);

    return (
        <div className="container_bites">
            {sortedData.map((val) => (
                <div
                    key={val.course_id || `${val.name}-${val.category}-${val.subcategory}`} // Ensure the key is unique
                    className="byte_container_content"
                    onMouseEnter={(e) => e.currentTarget.querySelector('.hover_content').style.display = 'block'}
                    onMouseLeave={(e) => e.currentTarget.querySelector('.hover_content').style.display = 'none'}
                >
                    <div className="byte_card_content" style={{ position: 'relative' }}>
                        
                        <a className="byte_link" href={val.url} target="_blank" rel="noreferrer">
                            {/* Apply the dynamic class to the .byte_card element */}
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
                            {/* Hover content */}
                            <div className="hover_content">
                                <p className="byte-description">{val.subtitle}</p>
                                {val.sponsor_img && (
                                    <div className="hover_sponsor">
                                        <p>Thanks to our Sponsor {val.sponsor_name}</p>
                                        <img src={val.sponsor_img} alt="sponsor-logo" className="hover_sponsor_logo" />
                                    </div>
                                )}
                                {/* Dynamic Status Display */}
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
