import { useState, useEffect } from "react";
import Mission_Cards from "./missionscards";
import Missions_Sub_filter from "./missionsubcategoryfilter";
import Page_header from "../Navbar/pageheader"
import Mission_Chain_Filter from "./missionschainsfilter";
import MissionEvaluator from "./mission_evulation";



function Missions_main_body() {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [missionsData, setMissionsData] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [criteria, setCriteria] = useState([]) 
   const [chains, setChains] = useState([]);
    const [userId, setUserId] = useState(null); // Dynamic User ID
    const [userBytes, setUserBytes] = useState([]); // User progress data (userBytes)

    // Simulate a user login (for testing purposes, we'll use a static user ID after a delay)
    useEffect(() => {
        setTimeout(() => {
            setUserId(555); // Test login user
        }, 2000); // Simulate delay for login
    }, []);

    // Fetch missions data
    useEffect(() => {
        const fetchMissionsData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/missionscards');
                const data = await response.json();
                setMissionsData(data);
            } catch (error) {
                console.error('Error fetching missions data:', error);
            }
        };

        fetchMissionsData();
    }, []);

    useEffect(() => {
        const fetchCriteria = async () => {
            const response = await fetch('http://localhost:3000/api/criteria/all');
            const data = await response.json();
            setCriteria(data);
        };
        fetchCriteria();
    }, []);

    // Fetch subcategories data
    useEffect(() => {
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
    }, []);

    // Fetch chains data
    useEffect(() => {
        const fetchChains = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/chains');
                const data = await response.json();
                setChains(data);
            } catch (error) {
                console.error('Error fetching chains:', error);
            }
        };

        fetchChains();
    }, []);

    // Fetch userBytes data (for logged-in users)
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

    // Available subcategories based on current selection and chains
    const availableSubcategories = subcategories.filter(subcat =>
        missionsData.some(mission => mission.subcategory_id === subcat.subcategory_id && 
                                   (activeFilter ? mission.chain_id === activeFilter : true))
    );

    // Available chains based on selected subcategory
    const availableFilters = chains.filter(chain => 
        missionsData.some(mission => 
            mission.chain_id === chain.chain_id && 
            (selectedSubcategory ? mission.subcategory_id === Number(selectedSubcategory) : true)
        )
    );

    // Reset all filters
    const resetAllFilters = () => {
        setSelectedSubcategory(null);
        setActiveFilter(null);
    };

    // Handle subcategory selection
    const handleSelectSubcategory = (subcat) => {
        setSelectedSubcategory(subcat);
    };

    // Handle chain filter selection
    const handleFilterSelect = (filter) => {
        setActiveFilter(filter);
    };

    // Apply filtering to the mission data
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

            {/* Pass the filtered data, userId, and userBytes to MissionEvaluator */}
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