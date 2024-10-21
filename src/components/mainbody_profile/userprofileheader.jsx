// UserProfileHeader.js
import React from "react";

function UserProfileHeader({ userName }) {
    return (
        <div className="user-profile-header">
            <h2>Welcome, {userName}!</h2>
        </div>
    );
}

export default UserProfileHeader;
