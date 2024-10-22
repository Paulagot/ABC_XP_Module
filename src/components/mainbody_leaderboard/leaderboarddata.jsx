import { useState, useEffect } from "react";

// Custom hook for fetching leaderboard data, with optional user-specific rank
// Export `useLeaderboardData` as a named export
export function useLeaderboardData(userId = null) {
    // Your data fetching and logic here
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [userRank, setUserRank] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const response = await fetch(`http://16.171.3.129:3000/api/leaderboard${userId ? `?userId=${userId}` : ""}`);

                const data = await response.json();

                setLeaderboardData(data.leaderboard);
                if (data.userRank !== undefined && data.userData) {
                    setUserRank(data.userRank);
                    setUserData(data.userData);
                }
            } catch (err) {
                console.error("Error fetching leaderboard data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboardData();
    }, [userId]);

    return { leaderboardData, userRank, userData, loading, error };
}

