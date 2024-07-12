import React from "react";

/**
 * Sub_filter component renders buttons for each subcategory and a reset button.
 * @param {Array} subcategories - Array of unique subcategories.
 * @param {string} selectedSubcategory - Currently selected subcategory.
 * @param {function} onSelectSubcategory - Function to handle subcategory selection.
 */
function Missions_Sub_filter({ subcategories = [], selectedSubcategory, onSelectSubcategory }) {
    return (
        <div className="container_sub-filter">
            {/* Render buttons for each subcategory */}
            {subcategories.map((subcat) => (
                <button
                    key={subcat}
                    className={`sub_filter ${selectedSubcategory === subcat ? 'active' : ''}`}
                    onClick={() => onSelectSubcategory(subcat)}
                >
                    {subcat}
                </button>
            ))}
            {/* Render a reset button to clear the subcategory filter */}
            <button
                className="sub_filter reset"
                onClick={() => onSelectSubcategory(null)}
            >
                Reset
            </button>
        </div>
    );
}

export default Missions_Sub_filter;

