//bytes main body
import React, { useState, useEffect } from "react";
import Bites_Sub_filter from "./bitessubfilter";
import Bites_Main_filter from "./bitesmainfilters";
import LearningAchievement from "./bitescompletepopup";
import { useAuth } from "../../context/auth_context"; // Import the AuthContext
import MissionCardWireframe from "./wireframe.jsx";

function Bites_main_body() {
    const { user } = useAuth(); // Access the logged-in user from AuthContext
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [bitesData, setBitesData] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isReadyToRender, setIsReadyToRender] = useState(false); // Controls rendering
    const [isLoading, setIsLoading] = useState(true); // For managing overall loading state
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Sequentially load data after triggering the progress update
    const fetchAllData = async () => {
        try {
           

            // Fetch bitesData
            const bitesResponse = await fetch(`${API_BASE_URL}/api/bitescards`);
            const bitesData = await bitesResponse.json();
            setBitesData(bitesData);

            // Fetch subcategories
            const subcategoriesResponse = await fetch(`${API_BASE_URL}/api/fetchsubcategories`);
            const subcategoriesData = await subcategoriesResponse.json();
            setSubcategories(subcategoriesData);

            // Fetch categories
            const categoriesResponse = await fetch(`${API_BASE_URL}/api/categories`);
            const categoriesData = await categoriesResponse.json();
            setCategories(categoriesData);

          
        } catch (error) {
            console.error("[Bites_main_body] Error during data fetch:", error);
        }
    };

    const triggerInitialDataUpdate = async () => {
        try {
           
            const response = await fetch(`${API_BASE_URL}/api/update-progress`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Include credentials for session cookies
            });

            if (!response.ok) {
                throw new Error(`Failed to update progress: ${response.statusText}`);
            }

            const result = await response.json();
           

            if (result.error) {
                console.error("[Bites_main_body] Error returned by progress update API:", result.error);
            }
        } catch (error) {
            console.error("[Bites_main_body] Error during initial progress update:", error);
        }
    };

    // Master useEffect to handle the sequential flow
    useEffect(() => {
        const loadData = async () => {
            if (user) {
               
                await triggerInitialDataUpdate(); // Wait for the progress update to complete
            } else {
                console.log("[Bites_main_body] No user detected, skipping progress update.");
            }

            await fetchAllData(); // Fetch data for both authenticated and unauthenticated users
            setIsReadyToRender(true); // Mark as ready to render after fetching data
            setIsLoading(false); // Stop the loading spinner
        };

        loadData();
    }, [user]);

    // Early return for loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Prevent rendering until all updates are done
    if (!isReadyToRender) {
        return <div>Preparing your content...</div>;
    }

    // Filter available subcategories and categories
    const availableSubcategories = subcategories.filter(subcat =>
        bitesData.some(bite => bite.subcategory === subcat.name &&
            (activeFilter ? bite.category === activeFilter : true))
    );

    const availableFilters = categories.filter(category =>
        bitesData.some(bite => bite.category === category.name &&
            (selectedSubcategory ? bite.subcategory === selectedSubcategory : true))
    );

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
                onSelectSubcategory={setSelectedSubcategory}
                resetAllFilters={() => {
                    setSelectedSubcategory(null);
                    setActiveFilter(null);
                }}
            />
            <Bites_Main_filter
                categories={availableFilters}
                activeFilter={activeFilter}
                onFilterSelect={setActiveFilter}
            />
            <MissionCardWireframe item={filteredData} />
            {user && <LearningAchievement userId={user.user_id} />}
        </main>
    );
}

export default Bites_main_body;
