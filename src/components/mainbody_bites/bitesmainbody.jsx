import React, { useState } from "react";
import Bites_Sub_filter from "./bitessubfilter";
import Bites_Main_filter from "./bitesmainfilters";
import Bites_Cards from "./bitescards";
import bitesdata from "../../bitesdata";
import Page_header from "../pageheader";


function Bites_main_body() {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);

    // Get unique subcategories from the data
    const subcategories = [...new Set(bitesdata.map(item => item.subcategory))];

    // Handle subcategory selection
    const handleSelectSubcategory = (subcat) => {
        setSelectedSubcategory(subcat);
    };

    // Handle category filter selection
    const handleFilterSelect = (filter) => {
        setActiveFilter(filter);
    };

    // Filter the data based on the selected subcategory and category
    const filteredData = bitesdata.filter(item => {
        const matchesSubcategory = selectedSubcategory ? item.subcategory === selectedSubcategory : true;
        const matchesCategory = activeFilter ? item.category === activeFilter : true;
        return matchesSubcategory && matchesCategory;
    });

    return (
        <main className="container__right" id="main">
             {/* Render header on smaller screens */}
             <div className="show-on-small-screen">
                <Page_header />
            </div>
                       
            <Bites_Main_filter 
                activeFilter={activeFilter}
                onFilterSelect={handleFilterSelect}
            />
            <Bites_Sub_filter
                subcategories={subcategories}
                selectedSubcategory={selectedSubcategory}
                onSelectSubcategory={handleSelectSubcategory}
            />
            <Bites_Cards item={filteredData} />
        </main>
    );
}

export default Bites_main_body;

 