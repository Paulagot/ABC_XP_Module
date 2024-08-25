import React from "react";
import { useLocation } from "react-router-dom";

function Page_header() {
  const location = useLocation();
  const { name, imgSrc } = location.state || { name: '', imgSrc: '' };

  return (
    <div className="main-header">
      <h1>{name}</h1>
      <img src={imgSrc} alt={`${name} Icon`} className="header_icon-placeholder" />
    </div>
  );
}

export default Page_header;


