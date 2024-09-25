import React from "react";

/**
 * Missions_Sub_filter renders buttons for each subcategory.
 * @param {Array} subcategories - List of subcategories.
 * @param {string} selectedSubcategory - Currently selected subcategory.
 * @param {function} onSelectSubcategory - Function to handle subcategory selection.
 * @param {function} resetAllFilters - Function to reset all filters.
 */
function Missions_Sub_filter({ subcategories = [], selectedSubcategory, onSelectSubcategory, resetAllFilters }) {
    return (
        <div className="container_sub-filter">
            {subcategories.map((subcat) => (
                <button
                    key={subcat.subcategory_id}
                    className={`sub_filter ${selectedSubcategory === subcat.subcategory_id ? 'active' : ''}`}
                    onClick={() => onSelectSubcategory(subcat.subcategory_id)}
                >
                    {subcat.name}
                </button>
            ))}
            <button onClick={resetAllFilters} className="reset_all_filters">
                Reset All Filters
            </button>
        </div>
    );
}

export default Missions_Sub_filter;



