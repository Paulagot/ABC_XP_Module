import React, { useState, useEffect } from 'react';
import axios from 'axios'
import SearchMissions from '../manage_missions/searchMissions.jsx';
import CriteriaForm from './formcriteria.jsx';
import CriteriaSection from './criteriaSelection.jsx';
import PropTypes from 'prop-types';

/**
 * ManageCriteria Component
 * This component manages the entire process of displaying and interacting with criteria for a selected mission.
 * 
 * Props:
 * - closePopup (function): Function to close the popup window.
 */
const ManageCriteria = ({ closePopup }) => {
    // State to hold the selected mission and its related criteria
    const [selectedMission, setSelectedMission] = useState(null); // Holds currently selected mission
    const [criteriaList, setCriteriaList] = useState([]); // Holds list of criteria for selected mission
    const [bites, setBites] = useState([]); // Holds list of bites for dropdowns/forms
    const [subcategories, setSubcategories] = useState([]); // Holds list of subcategories for dropdowns/forms
    const [message, setMessage] = useState(''); // State to hold messages to display in the UI
    const [messageType, setMessageType] = useState(''); // State to hold the type of the message (success or error)
    const [showConfirm, setShowConfirm] = useState(false); // State to control visibility of the confirmation dialog
    const [criterionToDelete, setCriterionToDelete] = useState(null); // State to store the criterion ID pending deletion
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Fetch bites and subcategories when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch subcategories
                const subcategoriesResponse = await axios.get(`${API_BASE_URL}/api/subcategories`);
                setSubcategories(subcategoriesResponse.data);

                // Fetch bites
                const bitesResponse = await axios.get(`${API_BASE_URL}/api/bitescards`);
                setBites(bitesResponse.data);
            } catch (error) {
                console.error('Error fetching bites or subcategories:', error);
                setMessage('Error fetching bites or subcategories.');
                setMessageType('error');
            }
        };

        fetchData();
    }, []);

    /**
     * Handle mission selection and fetch its criteria.
     * 
     * @param {Object} mission - The mission object that was selected.
     */
    const handleMissionSelect = async (mission) => {
        setSelectedMission(mission);

        try {
            // Fetch criteria for the selected mission
            const response = await axios.get(`${API_BASE_URL}/api/criteria?mission_id=${mission.mission_id}`);
            setCriteriaList(response.data);
        } catch (error) {
            console.error('Error fetching criteria:', error);
            setCriteriaList([]);
            setMessage('Error fetching criteria.');
            setMessageType('error');
        }
    };

    /**
     * Update criteria list after a new criterion is added.
     */
    const handleCriteriaUpdate = () => {
        handleMissionSelect(selectedMission); // Refresh criteria list after an update
    };

    /**
     * Show confirmation dialog for deleting a criterion.
     * 
     * @param {number} id - The ID of the criterion to be deleted.
     */
    const confirmDelete = (id) => {
        setShowConfirm(true); // Show confirmation dialog
        setCriterionToDelete(id); // Store ID of the criterion pending deletion
    };

    /**
     * Proceed with deleting a criterion from the database after confirmation.
     */
    const handleDeleteConfirmed = async () => {
        if (!criterionToDelete) return;

        try {
            // Send a DELETE request to the backend to remove the criterion from the database
            await axios.delete(`${API_BASE_URL}/api/criteria/${criterionToDelete}`);

            // Update the local state to reflect the deletion in the UI
            setCriteriaList(criteriaList.filter(criteria => criteria.criteria_id !== criterionToDelete));
            setMessage('Criterion deleted successfully!');
            setMessageType('success');
        } catch (error) {
            console.error('Error deleting criterion:', error);
            setMessage('Failed to delete criterion.');
            setMessageType('error');
        } finally {
            // Reset confirmation dialog state
            setShowConfirm(false);
            setCriterionToDelete(null);
        }
    };

    /**
     * Cancel deletion action and close confirmation dialog.
     */
    const handleDeleteCancelled = () => {
        setShowConfirm(false); // Hide confirmation dialog
        setCriterionToDelete(null); // Reset criterion pending deletion
    };

    return (
        <div id="manageCriteria" className="manageCriteriaPopup">
            <span id="closeManageCriteriaPopupBtn" className="closeButton" onClick={closePopup}>×</span>
            <h2>Manage Missions Criteria</h2>

            {/* Display message if available */}
            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}

            {/* Confirmation dialog for deletion */}
            {showConfirm && (
                <div className="confirmationDialog">
                    <p>Are you sure you want to delete this criterion?</p>
                    <button onClick={handleDeleteConfirmed}>Yes</button>
                    <button onClick={handleDeleteCancelled}>No</button>
                </div>
            )}

            {/* Mission selection component */}
            <SearchMissions onSelectMission={handleMissionSelect} />

            {/* Show criteria management components only when a mission is selected */}
            {selectedMission && (
                <>
                    {/* Component for adding new criteria */}
                    <CriteriaForm 
                        missionData={selectedMission} 
                        onCriteriaUpdate={handleCriteriaUpdate} 
                        setMessage={setMessage}  // Pass down the setMessage function to CriteriaForm
                        setMessageType={setMessageType} // Pass down the setMessageType function to CriteriaForm
                    />

                    {/* Component for displaying and managing existing criteria */}
                    <CriteriaSection 
                        criteriaType=""  
                        handleCriteriaTypeChange={() => {}}  
                        bites={bites}  
                        subcategories={subcategories}  
                        formData={{}}  
                        handleInputChange={() => {}}  
                        criteriaList={criteriaList}  
                        handleCriteriaUpdate={handleCriteriaUpdate}  
                        handleCriteriaDelete={confirmDelete}  // Pass down the delete handler that triggers confirmation
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