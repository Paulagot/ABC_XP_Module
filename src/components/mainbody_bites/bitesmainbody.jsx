import React, { useState, useEffect } from "react";
import Bites_Sub_filter from "./bitessubfilter";
import Bites_Main_filter from "./bitesmainfilters";
import Bites_Cards from "./bitescards"
import LearningAchievement from "./bitescompletepopup";
import { useAuth } from "../../context/auth_context"; // Import the AuthContext
import MissionCardWireframe from "./wireframe";



function Bites_main_body() {
    const { user } = useAuth(); // Access the logged-in user from AuthContext
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [bitesData, setBitesData] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false); // Track if all necessary data is loaded

    // Function to trigger initial progress update, only if user is logged in
    const triggerInitialDataUpdate = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/zenler-progress/all', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include' // Include credentials for session cookies if needed
            });
            const result = await response.json();
            console.log(result.message); // Log update summary
            setDataLoaded(true); // Set to true after progress update completes
        } catch (error) {
            console.error('Error during initial data update:', error);
        }
    };

    // Decide whether to run progress update or set dataLoaded directly based on user authentication
    useEffect(() => {
        if (user) {
            console.log("User is authenticated, triggering progress update.");
            triggerInitialDataUpdate(); // Run progress update if user is logged in
        } else {
            // If there's no user, mark data as loaded immediately for the other data fetches
            setDataLoaded(true);
        }
    }, [user]);

    // Fetch bites data only after progress update completes or immediately if no user is logged in
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

    // Fetch subcategories only after progress update completes or immediately if no user is logged in
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

    // Fetch categories only after progress update completes or immediately if no user is logged in
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

    // Filter available subcategories based on bites data and active filters
    const availableSubcategories = subcategories.filter(subcat =>
        bitesData.some(bite => bite.subcategory === subcat.name &&
                               (activeFilter ? bite.category === activeFilter : true))
    );

    // Filter available categories based on bites data and selected subcategory
    const availableFilters = categories.filter(category => 
        bitesData.some(bite => bite.category === category.name &&
                               (selectedSubcategory ? bite.subcategory === selectedSubcategory : true))
    );

    // Reset all filters to show full data
    const resetAllFilters = () => {
        setSelectedSubcategory(null);
        setActiveFilter(null);
    };

    // Handlers to set subcategory and main filter
    const handleSelectSubcategory = (subcat) => setSelectedSubcategory(subcat);
    const handleFilterSelect = (filter) => setActiveFilter(filter);

    // Filter bites data based on selected filters
    const filteredData = bitesData.filter(item => {
        const matchesSubcategory = selectedSubcategory ? item.subcategory === selectedSubcategory : true;
        const matchesCategory = activeFilter ? item.category === activeFilter : true;
        return matchesSubcategory && matchesCategory;
    });

    return (
        <main className="container__right" id="main">
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
            {/* <Bites_Cards item={filteredData} /> */}
            <MissionCardWireframe></MissionCardWireframe>

            {/* Conditionally render the LearningAchievement component only if user is authenticated and data is loaded */}
            {user && dataLoaded && <LearningAchievement userId={user.user_id} />}
        </main>
    );
}

export default Bites_main_body;