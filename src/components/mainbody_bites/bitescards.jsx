import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../../context/auth_context"; // Import useAuth to access authentication context, including user data and JWT token


// Bites_Cards component is responsible for rendering each course card (byte) and managing redirection with Zenler SSO
function Bites_Cards({ item = [] }) {
    const { user, zenlerToken } = useAuth(); // Access user and Zenler SSO token from AuthContext

    // State to store user-specific progress data for each byte (course)
    const [userBytesData, setUserBytesData] = useState([]);
    const [isLoggedIntoZenler, setIsLoggedIntoZenler] = useState(false); // Flag to track if the user is already logged into Zenler

    // Get user ID from the AuthContext's `user` object, if available
    const userId = user?.user_id;

    // Fetch the user's progress data for each byte (course) when the component mounts or the user ID changes
    useEffect(() => {
        if (userId) {
            // API call to fetch user-specific progress data for bytes
            fetch(`http://localhost:3000/api/user_bytes?user_id=${userId}`)
                .then(response => response.json())
                .then(data => setUserBytesData(data)) // Store the fetched data in `userBytesData` state
                .catch(err => console.error("Failed to fetch user bytes data", err));
        }
    }, [userId]);

    // Function to determine the status of each byte (Explore, Continue, Complete) based on progress data
    const getByteStatus = (biteId) => {
        // Return default "Explore Byte" status if no user is logged in
        if (!userId) return { text: "Explore Byte", className: "not-enrolled", order: 2 };

        // Check for matching byte in user progress data
        const userByte = userBytesData.find(ub => ub.bite_id === biteId);

        // Return appropriate status based on user progress data
        if (userByte && userByte.start_date && !userByte.completion_date) {
            return { text: "Continue Byte", className: "started", order: 1 };
        }

        if (userByte && userByte.completion_date) {
            return { text: "Byte Complete", className: "completed", order: 3 };
        }

        return { text: "Explore Byte", className: "not-enrolled", order: 2 }; // Default status for non-enrolled bytes
    };

    // Memoized sortedData: Combines byte data with status information and sorts by `order`
    const sortedData = useMemo(() => {
        if (!item || item.length === 0) return []; // Return empty array if no items provided

        // Map over each byte to add status and order, then sort
        return item.map(val => {
            const status = getByteStatus(val.bite_id); // Determine the status for each byte
            return { ...val, ...status }; // Combine byte data with status
        }).sort((a, b) => a.order - b.order); // Sort bytes by status order
    }, [item, userBytesData]);

    // Event handler to manage Zenler SSO and course redirection
    const handleByteClick = (courseUrl) => {
        if (!isLoggedIntoZenler && zenlerToken) { // If user is not logged in and token is available
            const errorUrl = "https://www.ablockofcrypto.com/blog"; // URL for error handling if SSO fails

            // Construct Zenler SSO URL with token, course URL, and error URL
            const zenlerBaseUrl = `https://ABlockofCrypto.newzenler.com/api/sso/v1?token=${zenlerToken}&return_to=${encodeURIComponent(courseUrl)}&error_url=${encodeURIComponent(errorUrl)}`;

            console.log("Redirecting to Zenler SSO URL:", zenlerBaseUrl);
            window.location.href = zenlerBaseUrl; // Open Zenler SSO link in the same tab

            setIsLoggedIntoZenler(true); // Set Zenler login status to true after successful SSO login
        } else {
            console.log("User already logged into Zenler; redirecting directly to course.");
            window.location.href = courseUrl; // Directly open course URL in the same tab
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
                                e.preventDefault(); // Prevent default link behavior to handle redirect
                                handleByteClick(val.url); // Trigger course redirection with Zenler SSO
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
