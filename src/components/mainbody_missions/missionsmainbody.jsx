import { useState } from "react";
import bitesdata from "../../bitesdata";
import Missions_Sub_filter from "./missionsubfilter";
import Mission_Cards from "./missionscards";
import Mission_Main_filter from "./missionmainfilters";
import Page_header from "../pageheader";



/**
 * Missions component manages the state for filtering mission cards based on category and subcategory.
 */
function Missions_main_body() {
    const [item, setItem] = useState(bitesdata);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);

    // Extract unique subcategories from bitesdata
    const subcategories = [...new Set(bitesdata.map((val) => val.subcategory))];

    /**
     * Handles the selection of a subcategory.
     * @param {string|null} subcategory - The selected subcategory or null to reset.
     */
    const handleSelectSubcategory = (subcategory) => {
        setSelectedSubcategory(subcategory);
        filterItems(activeCategory, subcategory);
    };

    /**
     * Handles the selection of a main category.
     * @param {string} category - The selected category.
     */
    const handleSelectCategory = (category) => {
        setActiveCategory(category);
        filterItems(category, selectedSubcategory);
    };

    /**
     * Filters the items based on the selected category and subcategory.
     * @param {string} category - The selected category.
     * @param {string|null} subcategory - The selected subcategory or null to reset.
     */
    const filterItems = (category, subcategory) => {
        let filteredItems = bitesdata;
        if (category) {
            filteredItems = filteredItems.filter((val) => val.category === category);
        }
        if (subcategory) {
            filteredItems = filteredItems.filter((val) => val.subcategory === subcategory);
        }
        setItem(filteredItems);
    };

    return (
        <main className="container__right" id="main">
           
                  
            {/* Render main category filter */}
            <Mission_Main_filter
                activeFilter={activeCategory}
                onFilterSelect={handleSelectCategory}
            />
            {/* Render subcategory filter */}
            <Missions_Sub_filter
                subcategories={subcategories}
                selectedSubcategory={selectedSubcategory}
                onSelectSubcategory={handleSelectSubcategory}
            />
            {/* Render mission cards */}
            <Mission_Cards item={item} />
        </main>
    );
}

export default Missions_main_body;