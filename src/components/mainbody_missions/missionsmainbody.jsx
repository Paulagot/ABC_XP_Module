import { useState } from "react";
import Mission_Cards from "./missionscards";
import Bites_Sub_filter from "../mainbody_bites/bitessubfilter";
import Bites_Main_filter from "../mainbody_bites/bitesmainfilters";


function Missions_main_body() {
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null);
    const [missionsData, setMissionsData] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [categories, setCategories] = useState([]);

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

    useEffect(() => {
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
    }, []);

    // Calculate available subcategories based on the selected main filter
    const availableSubcategories = subcategories.filter(subcat =>
        missionsData.some(mission => mission.subcategory === subcat.name && 
                               (activeFilter ? mission.category === activeFilter : true))
    );

    // Calculate available main filters based on the selected subcategory
    const availableFilters = categories.filter(category => 
        missionsData.some(mission => mission.category === category.name && 
                               (selectedSubcategory ? mission.subcategory === selectedSubcategory : true))
    );

    // Reset all filters
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

    const filteredData = missionsData.filter(item => {
        const matchesSubcategory = selectedSubcategory ? item.subcategory === selectedSubcategory : true;
        const matchesCategory = activeFilter ? item.category === activeFilter : true;
        return matchesSubcategory && matchesCategory;
    });

    return (
        <main className="container__right" id="main">
            <div className="show-on-small-screen">
                <Page_header />
            </div>
            <button onClick={resetAllFilters} className="reset_all_filters">
                Reset All Filters
            </button>
           
                  
            {/* Render main category filter */}
            <Bites_Main_filter
                subcategories={availableSubcategories}  // Pass only available subcategories
                selectedSubcategory={selectedSubcategory}
                onSelectSubcategory={handleSelectSubcategory}
            />
            {/* Render subcategory filter */}
            <Bites_Sub_filter
                categories={availableFilters}  // Pass only available filters
                activeFilter={activeFilter}
                onFilterSelect={handleFilterSelect}
            />
            {/* Render mission cards */}
            <Mission_Cards item={item} />
        </main>
    );
}

export default Missions_main_body;