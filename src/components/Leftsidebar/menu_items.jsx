import React from "react";
import { useNavigate } from "react-router-dom";

function Menu_items() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", imgSrc: "https://img.icons8.com/clouds/100/gender-neutral-user.png",path: "/dashboard" },
    { name: "Leaderboard", imgSrc: "https://img.icons8.com/clouds/100/leaderboard.png", path: "/leaderboard" },
    { name: "Bytes", imgSrc: "https://img.icons8.com/clouds/100/book-philosophy.png", path: "/bytes " },
    { name: "Missions", imgSrc: "https://img.icons8.com/clouds/100/rocket.png", path: "/missions" },
    { name: "Loyalty (soon)", imgSrc: "https://img.icons8.com/clouds/100/trust.png" },
  ];

  const handleNavigation = (item) => {
    navigate(item.path, { state: { name: item.name, imgSrc: item.imgSrc } });
  };

  return (
    <ul className="sidebar__list">
      {menuItems.map((item, index) => (
        <li key={index} className="sidebar__item">
          <div
            className="sidebar__link"
            onClick={() => handleNavigation(item)}
          >
            <img src={item.imgSrc} alt={`${item.name} Icon`} className="icon-placeholder" />
            <span>{item.name}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Menu_items;

