import { useState, useEffect } from "react";
import Missions_Sub_filter from "./missionsubcategoryfilter";
import Page_header from "../Navbar/pageheader"
import Mission_Chain_Filter from "./missionschainsfilter";
import MissionEvaluator from "./mission_evulation";
import { useAuth } from "../../context/auth_context"; // Import the AuthContext


function Missions_main_body() {
    // State to manage selected filters
    const [selectedSubcategory, setSelectedSubcategory] = useState(null); // Currently selected subcategory
    const [activeFilter, setActiveFilter] = useState(null); // Currently active chain filter

    // State to store data fetched from API calls
    const [missionsData, setMissionsData] = useState([]); // Missions data from database
    const [subcategories, setSubcategories] = useState([]); // Subcategories for filtering
    const [criteria, setCriteria] = useState([]); // Criteria to display in MissionEvaluator
    const [chains, setChains] = useState([]); // Chain data for filtering
    const [userBytes, setUserBytes] = useState([]); // User progress data (userBytes)

    const { user, isAuthenticated } = useAuth(); // Access logged-in user data from AuthContext
    const userId = isAuthenticated ? user.user_id : null; // Store user ID if logged in

    // State to track initial data setup completion
    const [initialDataLoaded, setInitialDataLoaded] = useState(false);

    // Initial data update sequence: 1. fetch-data, 2. mission-progress/update, then 3. remaining data
    useEffect(() => {
        const initializeData = async () => {
            try {
                // Step 1: Fetch general data (must complete before next step)
                await fetch('http://localhost:3000/api/fetch-data');

                // Step 2: Update mission progress data (must complete before remaining fetches)
                await fetch('http://localhost:3000/api/mission-progress/update');

                // Step 3: Fetch remaining data concurrently
                await Promise.all([
                    fetch('http://localhost:3000/api/missionscards')
                        .then(response => response.json())
                        .then(data => setMissionsData(data)),

                    fetch('http://localhost:3000/api/criteria/all')
                        .then(response => response.json())
                        .then(data => setCriteria(data)),

                    fetch('http://localhost:3000/api/fetchsubcategories')
                        .then(response => response.json())
                        .then(data => setSubcategories(data)),

                    fetch('http://localhost:3000/api/chains')
                        .then(response => response.json())
                        .then(data => setChains(data))
                ]);

                setInitialDataLoaded(true); // Mark initial data setup as complete
            } catch (error) {
                console.error('Error initializing data:', error);
            }
        };

        initializeData();
    }, []); // Run only once when component mounts

    // Fetch user progress (userBytes) data for the logged-in user
    useEffect(() => {
        if (userId) {
            const fetchUserBytes = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/user_bytes?user_id=${userId}`);
                    const data = await response.json();
                    setUserBytes(data); // Store userBytes data
                } catch (error) {
                    console.error('Error fetching user bytes:', error);
                }
            };

            fetchUserBytes();
        }
    }, [userId]); // Fetch userBytes only when userId is available

    // Filters subcategories based on selected chain and mission data
    const availableSubcategories = subcategories.filter(subcat =>
        missionsData.some(mission => mission.subcategory_id === subcat.subcategory_id &&
            (activeFilter ? mission.chain_id === activeFilter : true))
    );

    // Filters chains based on selected subcategory and mission data
    const availableFilters = chains.filter(chain =>
        missionsData.some(mission =>
            mission.chain_id === chain.chain_id &&
            (selectedSubcategory ? mission.subcategory_id === Number(selectedSubcategory) : true)
        )
    );

    // Resets all filters to their default states
    const resetAllFilters = () => {
        setSelectedSubcategory(null);
        setActiveFilter(null);
    };

    // Sets selected subcategory
    const handleSelectSubcategory = (subcat) => {
        setSelectedSubcategory(subcat);
    };

    // Sets active chain filter
    const handleFilterSelect = (filter) => {
        setActiveFilter(filter);
    };

    // Filters mission data based on selected subcategory and chain filter
    const filteredData = missionsData.filter(item => {
        const matchesSubcategory = selectedSubcategory ? item.subcategory_id === Number(selectedSubcategory) : true;
        const matchesChains = activeFilter ? item.chain_id === Number(activeFilter) : true;
        return matchesSubcategory && matchesChains;
    });

    return (
        <main className="container__right" id="main">
            <div className="show-on-small-screen">
                <Page_header />
            </div>

            <Missions_Sub_filter
                subcategories={availableSubcategories}
                selectedSubcategory={selectedSubcategory}
                onSelectSubcategory={handleSelectSubcategory}
                resetAllFilters={resetAllFilters}
            />

            <Mission_Chain_Filter 
                chains={availableFilters}
                activeFilter={activeFilter}
                onFilterSelect={handleFilterSelect}
            />

            {/* Pass the filtered mission data, userId, and user progress data to MissionEvaluator */}
            <MissionEvaluator 
                missions={filteredData}
                userId={userId}
                userBytes={userBytes} // Pass user progress data to MissionEvaluator
                criteria={criteria}             
            />
        </main>
    );
}

export default Missions_main_body;