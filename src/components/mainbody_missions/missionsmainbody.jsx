import { useState, useEffect } from "react";
import Missions_Sub_filter from "./missionsubcategoryfilter";
import Mission_Chain_Filter from "./missionschainsfilter";
import MissionEvaluator from "./mission_evulation";
import { useAuth } from "../../context/auth_context"; // Import the AuthContext


function Missions_main_body() {
    // State to manage selected filters
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);

    // State to store data fetched from API calls
    const [missionsData, setMissionsData] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [criteria, setCriteria] = useState([]);
    const [chains, setChains] = useState([]);
    const [userBytes, setUserBytes] = useState([]);

    const { user, isAuthenticated } = useAuth(); // Access logged-in user data from AuthContext
    const userId = isAuthenticated ? user.user_id : null;

    // State to track loading and readiness
    const [isLoading, setIsLoading] = useState(true);
    const [isReadyToRender, setIsReadyToRender] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Function to trigger mission progress update
    const triggerMissionProgressUpdate = async () => {
        try {
         
            const response = await fetch(`${API_BASE_URL}/api/update-progress?type=mission`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Include credentials for session cookies
            });

            if (!response.ok) {
                throw new Error(`Failed to update mission progress: ${response.statusText}`);
            }

            const result = await response.json();
            
        } catch (error) {
            console.error("[Missions_main_body] Error updating mission progress:", error);
        }
    };

    // Function to fetch all mission-related data
    const fetchMissionData = async () => {
        try {
            
            const [missions, subcategories, chains, criteria] = await Promise.all([
                fetch(`${API_BASE_URL}/api/missionscards`).then((res) => res.json()),
                fetch(`${API_BASE_URL}/api/fetchsubcategories`).then((res) => res.json()),
                fetch(`${API_BASE_URL}/api/chains`).then((res) => res.json()),
                fetch(`${API_BASE_URL}/api/criteria/all`).then((res) => res.json()),
            ]);

         

            // Update state
            setMissionsData(missions);
            setSubcategories(subcategories);
            setChains(chains);
            setCriteria(criteria);
            setIsReadyToRender(true); // Mark data as ready for rendering
        } catch (error) {
            console.error("[Missions_main_body] Error fetching mission-related data:", error);
        } finally {
            setIsLoading(false); // Ensure loading state ends
        }
    };

    // Master useEffect to handle sequential flow
    useEffect(() => {
        const initializeData = async () => {
            try {
                if (userId) {
                  
                    await triggerMissionProgressUpdate(); // Wait for the database to update
                } else {
                   
                }
    
                // Fetch mission-related data only after progress update completes
                await fetchMissionData();
                setIsReadyToRender(true); // Mark data as ready for rendering
            } catch (error) {
                console.error("[Missions_main_body] Initialization error:", error);
            } finally {
                setIsLoading(false); // Ensure loading state ends
            }
        };
    
        initializeData();
    }, [userId]);
    

    // Fetch user progress (userBytes) when userId is available
    useEffect(() => {
        const fetchUserBytes = async () => {
            try {
                
                const response = await fetch(`${API_BASE_URL}/api/user_bytes?user_id=${userId}`);
                const data = await response.json();
               
                setUserBytes(data);
            } catch (error) {
                console.error("[Missions_main_body] Error fetching user bytes:", error);
            }
        };

        if (userId) fetchUserBytes();
    }, [userId]);

    // Early return for loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Prevent rendering until all data is ready
    if (!isReadyToRender) {
        return <div>Preparing your content...</div>;
    }

    // Filters subcategories based on selected chain and mission data
    const availableSubcategories = subcategories.filter((subcat) =>
        missionsData.some(
            (mission) =>
                mission.subcategory_id === subcat.subcategory_id &&
                (activeFilter ? mission.chain_id === activeFilter : true)
        )
    );

    // Filters chains based on selected subcategory and mission data
    const availableFilters = chains.filter((chain) =>
        missionsData.some(
            (mission) =>
                mission.chain_id === chain.chain_id &&
                (selectedSubcategory ? mission.subcategory_id === Number(selectedSubcategory) : true)
        )
    );

    // Filters mission data based on selected subcategory and chain filter
    const filteredData = missionsData.filter((item) => {
        const matchesSubcategory = selectedSubcategory ? item.subcategory_id === Number(selectedSubcategory) : true;
        const matchesChains = activeFilter ? item.chain_id === Number(activeFilter) : true;
        return matchesSubcategory && matchesChains;
    });

    // Resets all filters to their default states
    const resetAllFilters = () => {
        setSelectedSubcategory(null);
        setActiveFilter(null);
    };

    return (
        <main className="container__right" id="main">
            <Missions_Sub_filter
                subcategories={availableSubcategories}
                selectedSubcategory={selectedSubcategory}
                onSelectSubcategory={setSelectedSubcategory}
                resetAllFilters={resetAllFilters}
            />

            <Mission_Chain_Filter
                chains={availableFilters}
                activeFilter={activeFilter}
                onFilterSelect={setActiveFilter}
            />

<MissionEvaluator
    missions={filteredData}
    userId={userId}
    userBytes={userBytes}
    criteria={criteria}
    isReadyToRender={isReadyToRender} // Pass readiness to child components
/>
        </main>
    );
}

export default Missions_main_body;
