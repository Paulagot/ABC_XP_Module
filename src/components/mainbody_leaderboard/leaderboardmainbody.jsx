import React from "react";
import { useLeaderboardData } from "./leaderboarddata";
import Page_header from "../Navbar/pageheader";
import LeaderboardHeader from "./leaderboardheader";
import LeaderboardRow from "./leaderboardrow";
import LeaderboardBackground from "./leaderboardbackground";
import { useAuth } from "../../context/auth_context"; // Import the AuthContext

// Main Leaderboard component responsible for rendering leaderboard table and user ranking information
function Leaderboard_main_body() {
    // Access user authentication status and user data from AuthContext
    const { isAuthenticated, user } = useAuth();

    // Fetch leaderboard data and user-specific rank if logged in
    const { leaderboardData, userRank, userData, loading, error } = useLeaderboardData(isAuthenticated ? user.user_id : null);

    return (
        <main className="container__right" id="main">
           

            <LeaderboardBackground />

            <div className="leaderboard-container">
                <h5>This Leaderboard will update at midnight every Sunday</h5>

                {/* Show user-specific ranking message if user is logged in */}
                {isAuthenticated && userData && userRank && (
                    <div className="user-ranking">
                        {userData.user_name}, you rank {userRank} with {userData.learning_points} Learning Points and {userData.experience_points} Experience Points.
                    </div>
                )}

                {loading && <p>Loading...</p>}
                {error && <p>Error loading leaderboard data.</p>}

                {!loading && !error && (
                    <table className="leaderboard-table">
                        <LeaderboardHeader />
                        <tbody>
                            {leaderboardData.map((user, index) => (
                                <LeaderboardRow
                                    key={user.user_id}
                                    rank={index + 1}
                                    userName={user.user_name}
                                    learningPoints={user.learning_points}
                                    experiencePoints={user.experience_points}
                                    totalPoints={user.total_points}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    );
}

export default Leaderboard_main_body;