import React from "react";

/**
 * Bites_Sub_filter component renders buttons for each subcategory
 * and includes a reset button to reset all filters.
 * @param {Array} subcategories - Array of subcategory objects.
 * @param {string} selectedSubcategory - Currently selected subcategory.
 * @param {function} onSelectSubcategory - Function to handle subcategory selection.
 * @param {function} resetAllFilters - Function to reset all filters.
 */
function Bites_Sub_filter({ subcategories = [], selectedSubcategory, onSelectSubcategory, resetAllFilters }) {
    return (
        <div className="container_sub-filter">
           
            {subcategories.map((subcat) => (
                <div
                    key={subcat.subcategory_id}  // Use subcategory_id as the unique key
                    className={`sub_filter ${selectedSubcategory === subcat.name ? 'active' : ''}`}
                    onClick={() => onSelectSubcategory(subcat.name)}
                >
                    {subcat.name}
                </div>
            ))}
             <button  onClick={resetAllFilters} className="reset_all_filters">
                Reset All Filters
            </button>
        </div>
    );
}

export default Bites_Sub_filter;




