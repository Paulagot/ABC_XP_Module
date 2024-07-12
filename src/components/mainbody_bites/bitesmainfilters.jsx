import React from "react";

function Bites_Main_filter({ activeFilter, onFilterSelect }) {
    // Define filter data
    const filterData = [
        { name: "Essentials", iconUrl: "https://img.icons8.com/clouds/100/1-circle-c.png" },
        { name: "Beginner", iconUrl: "https://img.icons8.com/clouds/100/2--v2.png" },
        { name: "Intermediate", iconUrl: "https://img.icons8.com/clouds/100/3.png" },
        { name: "Advanced", iconUrl: "https://img.icons8.com/clouds/100/4.png" },
    ];

    return (
        <div className="container_main-filter">
            {filterData.map((filterItem, index) => (
                <div
                    key={index}
                    className={`main_filter ${activeFilter === filterItem.name ? "active" : ""}`}
                    onClick={() => onFilterSelect(filterItem.name)}
                >
                    {filterItem.name}
                    <img
                        src={filterItem.iconUrl}
                        alt={`${filterItem.name} Icon`}
                        className="filter_icon-placeholder"
                    />
                </div>
            ))}
        </div>
    );
}

export default Bites_Main_filter;
