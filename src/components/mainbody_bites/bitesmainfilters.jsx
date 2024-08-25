import React from "react";

function Bites_Main_filter({ categories = [], activeFilter, onFilterSelect }) {
    return (
        <div className="container_main-filter">
            {categories.map((category) => (
                <div
                    key={category.category_id}  // Use category_id as the unique key
                    className={`main_filter ${activeFilter === category.name ? "active" : ""}`}
                    onClick={() => onFilterSelect(category.name)}
                >
                    {category.name}
                </div>
            ))}
        </div>
    );
}

export default Bites_Main_filter;





