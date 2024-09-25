import { useState, useEffect } from "react";


function Singin_btn (){
    const [tUserLoggedIn, setTUserLoggedIn] = useState(true); // Simulate login state

    const handleClick = () => {
      if (tUserLoggedIn) {
        // Handle sign out logic here, like clearing user data, tokens, etc.
        setTUserLoggedIn(false); // Simulate user logging out
      } else {
        // Redirect to the login page
        window.location.href = "https://www.ablockofcrypto.com/login";
      }
    };
  
    return (
      <button type="button" className="navbar__sign-in-btn" onClick={handleClick}>
        {tUserLoggedIn ? "Sign Out" : "Sign In"}
      </button>
    );
  }

export default Singin_btn