import React, { useState, useEffect } from 'react';
import axios from 'axios'
import SearchMissions from '../manage_missions/searchMissions.jsx';
import CriteriaForm from './formcriteria.jsx';
import CriteriaSection from './criteriaSelection.jsx';
import PropTypes from 'prop-types';


/**
 * ManageCriteria Component
 * This component manages the entire process of displaying and interacting with criteria for a selected mission.
 */
const ManageCriteria = ({ closePopup }) => {
    // State to hold selected mission and its related criteria
    const [selectedMission, setSelectedMission] = useState(null);
    const [criteriaList, setCriteriaList] = useState([]);
    const [bites, setBites] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    // Fetch bites and subcategories when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const subcategoriesResponse = await axios.get('http://localhost:3000/api/subcategories');
                setSubcategories(subcategoriesResponse.data);

                const bitesResponse = await axios.get('http://localhost:3000/api/bitescards');
                setBites(bitesResponse.data);
            } catch (error) {
                console.error('Error fetching bites or subcategories:', error);
            }
        };

        fetchData();
    }, []);

    // Handle mission selection and fetch its criteria
    const handleMissionSelect = async (mission) => {
        setSelectedMission(mission);

        try {
            const response = await axios.get(`http://localhost:3000/api/criteria?mission_id=${mission.mission_id}`);
            setCriteriaList(response.data);
        } catch (error) {
            console.error('Error fetching criteria:', error);
            setCriteriaList([]);
        }
    };

    // Update criteria list after a new criterion is added
    const handleCriteriaUpdate = () => {
        handleMissionSelect(selectedMission);
    };

    return (
        <div id="manageCriteria" className="manageCriteriaPopup">
            <span id="closeManageCriteriaPopupBtn" className="closeButton" onClick={closePopup}>×</span>
            <h2>Manage Missions Criteria</h2>

            <SearchMissions onSelectMission={handleMissionSelect} />

            {selectedMission && (
                <>
                    <CriteriaForm 
                        missionData={selectedMission} 
                        onCriteriaUpdate={handleCriteriaUpdate} 
                    />

                    <CriteriaSection 
                        criteriaType=""  
                        handleCriteriaTypeChange={() => {}}  
                        bites={bites}  
                        subcategories={subcategories}  
                        formData={{}}  
                        handleInputChange={() => {}}  
                        criteriaList={criteriaList}  
                        handleCriteriaUpdate={handleCriteriaUpdate}  
                        handleCriteriaDelete={(id) => setCriteriaList(criteriaList.filter(criteria => criteria.criteria_id !== id))}  
                        handleAddCriteria={() => {}} 
                    />
                </>
            )}
        </div>
    );
};

// PropTypes validation
ManageCriteria.propTypes = {
    closePopup: PropTypes.func.isRequired,  // Function to close the popup
};

export default ManageCriteria;