
import React, { useState, useEffect } from "react";

import { useAuth } from "../../context/auth_context"; // Import the AuthContext
import CategoryNFTDashboard from "./CategoryNFTDashboard";


function Profile_main_body() {
    const { user } = useAuth(); // Access the logged-in user from AuthContext
  

    return (
        <main className="container__right" id="main">
        <CategoryNFTDashboard />
        </main>
    );
}

export default Profile_main_body;
