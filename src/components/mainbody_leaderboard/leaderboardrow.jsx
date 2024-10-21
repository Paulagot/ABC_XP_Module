import React from "react";

function LeaderboardRow({ rank, userName, learningPoints, experiencePoints, totalPoints }) {
    return (
        <tr>
            <td>{rank}</td>
            <td>{userName}</td>
            <td>{learningPoints}</td>
            <td>{experiencePoints}</td>
            <td>{totalPoints}</td>
        </tr>
    );
}

export default LeaderboardRow;
