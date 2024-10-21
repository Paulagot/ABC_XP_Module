import React, { useEffect, useState } from "react";
import Page_header from "../Navbar/pageheader";
import UserProfileHeader from "./userprofileheader";
import SubcategoryProgress  from "./subcategoryprogress";
import LPAccumulation from "./lpaccumulation";

function Profile_main_body() {
    // State to store user profile, progress, and LP data
    const [userData, setUserData] = useState(null);
    const [progressData, setProgressData] = useState([]);
    const [lpData, setLpData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch user profile data, including progress and LP accumulation
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/profile"); // Adjust the endpoint as necessary
                const data = await response.json();

                setUserData(data.user);
                setProgressData(data.progress);
                setLpData(data.lpAccumulation);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching profile data:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main className="container__right" id="main">
            {/* Render header on smaller screens */}
            <div className="show-on-small-screen">
                <Page_header />
            </div>

            {/* Show loading or error state if applicable */}
            {loading && <p>Loading...</p>}
            {error && <p>Error loading profile data.</p>}

            {/* Render user profile, progress, and LP accumulation sections */}
            {!loading && !error && (
                <>
                    {userData && <UserProfileHeader userName={userData.name} />}
                    <div className="progress-section">
                        {progressData.map((subcategory) => (
                            <SubcategoryProgress key={subcategory.id} subcategory={subcategory} />
                        ))}
                    </div>
                    <div className="lp-accumulation-section">
                        {lpData.map((lp) => (
                            <LPAccumulation key={lp.subcategoryId} lp={lp} />
                        ))}
                    </div>
                </>
            )}
        </main>
    );
}

export default Profile_main_body;
