import React from "react";
import { useLocation, useParams } from "react-router-dom";

function Page_header() {
  const location = useLocation();
  const { slug } = useParams(); // Extract dynamic parameter (if available)

  // Map of pathnames to default values
  const pageData = {
    "/leaderboard": { name: "Leaderboard", imgSrc: "https://img.icons8.com/clouds/100/leaderboard.png" },
    "/bytes": { name: "Bytes", imgSrc: "https://img.icons8.com/clouds/100/book-philosophy.png" },
    "/missions": { name: "Missions", imgSrc: "https://img.icons8.com/clouds/100/rocket.png" },
    "/dashboard": { name: "Dashboard", imgSrc: "https://img.icons8.com/clouds/100/gender-neutral-user.png" },
    "/loyalty": { name: "Loyalty (soon)", imgSrc: "https://img.icons8.com/clouds/100/trust.png" },
    "/register": { name: "Register", imgSrc: "https://img.icons8.com/clouds/100/enter-2.png" }, // Added register
    "/learnfi": { name: "Swap/Bridge", imgSrc: "https://img.icons8.com/clouds/100/trust.png" },
    "/learnfi/from-token": { name: "Swap/Bridge", imgSrc: "https://img.icons8.com/clouds/100/trust.png" },
    "/learnfi/to-token": { name: "Swap/Bridge", imgSrc: "https://img.icons8.com/clouds/100/trust.png" },
    "/learnfi/transaction-history": { name: "Swap/Bridge", imgSrc: "https://img.icons8.com/clouds/100/trust.png" },
    "/learnfi/settings": { name: "Swap/Bridge", imgSrc: "https://img.icons8.com/clouds/100/trust.png" },
    "/learnfi/settings/languages": { name: "Swap/Bridge", imgSrc: "https://img.icons8.com/clouds/100/trust.png" },
    "learnfi/settings/bridges": { name: "Swap/Bridge", imgSrc: "https://img.icons8.com/clouds/100/trust.png" },
    "learnfi/settings/exchanges": { name: "Swap/Bridge", imgSrc: "https://img.icons8.com/clouds/100/trust.png" },
  };

  // Fallback logic for dynamic routes
  if (location.pathname.startsWith("/bytes/") && slug) {
    pageData[location.pathname] = {
      name: `Bytes`, // Replace dashes with spaces for better readability
      imgSrc: "https://img.icons8.com/clouds/100/book-philosophy.png", // Default image for bytes
    };
  }

  if (location.pathname.startsWith("/missions/") && slug) {
    pageData[location.pathname] = {
      name: `Missions`,
      imgSrc: "https://img.icons8.com/clouds/100/rocket.png", // Default image for missions
    };
  }

  // Extract data from location.state or fallback to pageData
  const { name, imgSrc } = location.state || pageData[location.pathname] || { name: "Page Not Found", imgSrc: "" };

  return (
    <div className="main-header">
      <h1>{name}</h1>
      {imgSrc && <img src={imgSrc} alt={`${name} Icon`} className="header_icon-placeholder" />}
    </div>
  );
}

export default Page_header;




