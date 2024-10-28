import React, { useState, useEffect } from "react";
import Bites_Sub_filter from "./bitessubfilter";
import Bites_Main_filter from "./bitesmainfilters";
import Bites_Cards from "./bitescards";
import Page_header from "../Navbar/pageheader";
import LearningAchievement from "./bitescompletepopup";
import { useAuth } from "../../context/auth_context"; // Import the AuthContext


function Bites_main_body() {
    const { user } = useAuth(); // Access the logged-in user from AuthContext
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [bitesData, setBitesData] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false); // New state to track data loading completion

    // Function to trigger initial database updates
    const triggerInitialDataUpdate = async () => {
        try {
            await fetch('http://localhost:3000/api/fetch-data');
            await fetch('http://localhost:3000/api/zenler-progress/all');
            setDataLoaded(true); // Set to true after initial data update completes
        } catch (error) {
            console.error('Error during initial data update:', error);
        }
    };

    // Run initial database update only once
    useEffect(() => {
        triggerInitialDataUpdate();
    }, []);

    // Fetch bites data only after initial data update completes
    useEffect(() => {
        if (dataLoaded) {
            const fetchBitesData = async () => {
                try {
                    const response = await fetch('http://localhost:3000/api/bitescards');
                    const data = await response.json();
                    setBitesData(data);
                } catch (error) {
                    console.error('Error fetching bites data:', error);
                }
            };

            fetchBitesData();
        }
    }, [dataLoaded]);

    // Fetch subcategories only after initial data update completes
    useEffect(() => {
        if (dataLoaded) {
            const fetchSubcategories = async () => {
                try {
                    const response = await fetch('http://localhost:3000/api/fetchsubcategories');
                    const data = await response.json();
                    setSubcategories(data);
                } catch (error) {
                    console.error('Error fetching subcategories:', error);
                }
            };

            fetchSubcategories();
        }
    }, [dataLoaded]);

    // Fetch categories only after initial data update completes
    useEffect(() => {
        if (dataLoaded) {
            const fetchCategories = async () => {
                try {
                    const response = await fetch('http://localhost:3000/api/categories');
                    const data = await response.json();
                    setCategories(data);
                } catch (error) {
                    console.error('Error fetching categories:', error);
                }
            };

            fetchCategories();
        }
    }, [dataLoaded]);

    const availableSubcategories = subcategories.filter(subcat =>
        bitesData.some(bite => bite.subcategory === subcat.name &&
                               (activeFilter ? bite.category === activeFilter : true))
    );

    const availableFilters = categories.filter(category => 
        bitesData.some(bite => bite.category === category.name &&
                               (selectedSubcategory ? bite.subcategory === selectedSubcategory : true))
    );

    const resetAllFilters = () => {
        setSelectedSubcategory(null);
        setActiveFilter(null);
    };

    const handleSelectSubcategory = (subcat) => {
        setSelectedSubcategory(subcat);
    };

    const handleFilterSelect = (filter) => {
        setActiveFilter(filter);
    };

    const filteredData = bitesData.filter(item => {
        const matchesSubcategory = selectedSubcategory ? item.subcategory === selectedSubcategory : true;
        const matchesCategory = activeFilter ? item.category === activeFilter : true;
        return matchesSubcategory && matchesCategory;
    });

    return (
        <main className="container__right" id="main">
            <div className="show-on-small-screen">
                <Page_header />
            </div>
            
            <Bites_Sub_filter
                subcategories={availableSubcategories}
                selectedSubcategory={selectedSubcategory}
                onSelectSubcategory={handleSelectSubcategory}
                resetAllFilters={resetAllFilters}
            />
            <Bites_Main_filter 
                categories={availableFilters}
                activeFilter={activeFilter}
                onFilterSelect={handleFilterSelect}
            />
            <Bites_Cards 
                item={filteredData} 
            />

            {/* Conditionally render the LearningAchievement component only if the user is logged in */}
            {user && <LearningAchievement userId={user.user_id} />}
        </main>
    );
}

export default Bites_main_body;
