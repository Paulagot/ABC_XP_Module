import React from "react";

function LeaderboardRow({ rank, userName, learningPoints, experiencePoints, totalPoints }) {
    // Determine what to display for the rank based on its value
    const displayRank = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;

    return (
        <tr>
            <td>{displayRank}</td>
            <td>{userName}</td>
            <td>{learningPoints}</td>
            <td>{experiencePoints}</td>
            <td>{totalPoints}</td>
        </tr>
    );
}

export default LeaderboardRow;
