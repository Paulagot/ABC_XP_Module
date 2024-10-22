import React, { useState, useEffect } from 'react';

import axios from 'axios';
import PropTypes from 'prop-types';


/**
 * CriteriaForm Component
 * This component renders a form to add new criteria for the selected mission.
 * It handles the form state, validation, and submission to the server.
 * 
 * Props:
 * - missionData (object): The mission data object.
 * - onCriteriaUpdate (function): Function to update the criteria list.
 * - setMessage (function): Function to set the message to display in the UI.
 * - setMessageType (function): Function to set the type of message (success or error).
 */
const CriteriaForm = ({ missionData, onCriteriaUpdate, setMessage, setMessageType }) => {
    // Initialize form state
    const [formData, setFormData] = useState({
        criteriaType: '',
        conditionType: '',
        biteId: '',
        subcategoryId: '',
        lpValue: '',
    });

    // Control visibility of form sections based on selected criteria type
    const [criteriaBiteDisplay, setCriteriaBiteDisplay] = useState('none');
    const [criteriaSubCategoryDisplay, setCriteriaSubCategoryDisplay] = useState('none');
    const [lpRequiredDisplay, setLpRequiredDisplay] = useState('none');
    const [bites, setBites] = useState([]);
    const [subcategories, setSubcategories] = useState([]);

    // Fetch bites and subcategories options when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch subcategories from the server
                const subcategoriesResponse = await axios.get('http://16.171.3.129:3000/api/subcategories');
                setSubcategories(subcategoriesResponse.data);

                // Fetch bites from the server
                const bitesResponse = await axios.get('http://16.171.3.129:3000/api/bites');
                setBites(bitesResponse.data);
            } catch (error) {
                console.error('Error fetching bites or subcategories:', error);
                setMessage('Error fetching bites or subcategories.');  // Display error message in the UI
                setMessageType('error');
            }
        };

        fetchData();
    }, []);

    // Update form visibility based on the selected criteria type
    useEffect(() => {
        if (formData.criteriaType === 'Bite Complete') {
            setCriteriaBiteDisplay('block');
            setCriteriaSubCategoryDisplay('none');
            setLpRequiredDisplay('none');
        } else if (formData.criteriaType === 'LP Required') {
            setCriteriaBiteDisplay('none');
            setCriteriaSubCategoryDisplay('block');
            setLpRequiredDisplay('block');
        } else {
            setCriteriaBiteDisplay('none');
            setCriteriaSubCategoryDisplay('none');
            setLpRequiredDisplay('none');
        }
    }, [formData.criteriaType]);

    /**
     * Handle form input changes.
     * 
     * @param {Object} e - The event object from the input change.
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    /**
     * Handle form submission.
     * 
     * @param {Object} e - The event object from form submission.
     */
    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields before submission
        if (formData.criteriaType === 'Bite Complete' && (!formData.biteId || !formData.conditionType)) {
            setMessage('Please select a Bite and set criteria before submitting.');  // Display validation message
            setMessageType('error');
            return;
        }
        if (formData.criteriaType === 'LP Required' && (!formData.subcategoryId || !formData.lpValue || !formData.conditionType)) {
            setMessage('Please select a Sub-Category and set LP value and condition type before submitting.');  // Display validation message
            setMessageType('error');
            return;
        }

        // Prepare data to be sent to the backend
        const formDataToSend = {
            mission_id: missionData.mission_id,
            criteria_type: formData.criteriaType,
            condition_type: formData.conditionType,
            bite_id: formData.biteId || null,
            subcategory_id: formData.subcategoryId || null,
            lp_value: formData.lpValue || null
        };

        console.log('Form data being sent:', formDataToSend);  // Debugging: log form data to console

        try {
            // Send the form data to the server via a POST request
            const response = await axios.post('http://16.171.3.129:3000/api/criteria', formDataToSend);

            // Call the update function passed as a prop to refresh the criteria list
            onCriteriaUpdate(response.data);
            setMessage('Criteria added successfully!');  // Display success message in the UI
            setMessageType('success');

            // Reset the form fields and visibility after submission
            setFormData({
                criteriaType: '',
                conditionType: '',
                biteId: '',
                subcategoryId: '',
                lpValue: '',
            });
            setCriteriaBiteDisplay('none');
            setCriteriaSubCategoryDisplay('none');
            setLpRequiredDisplay('none');

        } catch (error) {
            console.error('Error adding criteria:', error);
            setMessage('Error adding criteria.');  // Display error message in the UI
            setMessageType('error');
        }
    };

    return (
        <form id="criteriaForm" onSubmit={handleFormSubmit}>
            <h3>Add New Criteria for {missionData.name}</h3>
            
            {/* Criteria Type Selection */}
            <div className="criteriaType">
                <label htmlFor="criteriaTypeMatch">Select Criteria Type</label>
                <select
                    name="criteriaType"
                    onChange={handleInputChange}
                    value={formData.criteriaType || ''}
                >
                    <option value="" disabled>Select your option</option>
                    <option value="Bite Complete">Bite Complete</option>
                    <option value="LP Required">LP Required</option>
                </select><br /><br />
            </div>

            {/* Conditionally rendered fields based on criteria type selection */}
            <div className="criteriaBiteSelection" style={{ display: criteriaBiteDisplay }}>
                <label htmlFor="criteriaBiteMatch">Select Bite</label>
                <select
                    name="biteId"
                    value={formData.biteId || ''}
                    onChange={handleInputChange}
                >
                    <option value="" disabled>Select your option</option>
                    {Array.isArray(bites) && bites.length > 0 ? (
                        bites.map((bite) => (
                            <option key={bite.bite_id} value={bite.bite_id}>
                                {bite.name}
                            </option>
                        ))
                    ) : (
                        <option value="null">No Bites Available</option>
                    )}
                </select><br /><br />
            </div>

            <div className="criteriaSubCategorySelection" style={{ display: criteriaSubCategoryDisplay }}>
                <label htmlFor="criteriaSubCategoryMatch">Select Sub-Category</label>
                <select
                    name="subcategoryId"
                    value={formData.subcategoryId || ''}
                    onChange={handleInputChange}
                >
                    <option value="" disabled>Select your option</option>
                    {Array.isArray(subcategories) && subcategories.length > 0 ? (
                        subcategories.map((subcategory) => (
                            <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                                {subcategory.name}
                            </option>
                        ))
                    ) : (
                        <option value="null">No Subcategories Available</option>
                    )}
                </select><br /><br />
            </div>
            
            {/* LP Required field */}
            <div className="lpRequired" style={{ display: lpRequiredDisplay }}>
                <label htmlFor="lpRequired">LP Required:</label>
                <input
                    type="number"
                    id="lpRequired"
                    name="lpValue"
                    value={formData.lpValue || ''}
                    onChange={handleInputChange}
                /><br /><br />
            </div>

            {/* Condition Type Selection */}
            <h3>Set Criteria</h3>
            <select name="conditionType" value={formData.conditionType || ''} onChange={handleInputChange}>
                <option value="" disabled>Select your option</option>
                <option value="And">AND</option>
                <option value="Or">OR</option>
                <option value="None">None</option>
            </select><br /><br />

            {/* Submit Button */}
            <button type="submit">Add Criteria</button>
        </form>
    );
};

// PropTypes validation
CriteriaForm.propTypes = {
    missionData: PropTypes.object.isRequired,  // The mission data object
    onCriteriaUpdate: PropTypes.func.isRequired,  // Function to update the criteria list
    setMessage: PropTypes.func.isRequired,  // Function to set a message to display in the UI
    setMessageType: PropTypes.func.isRequired,  // Function to set the type of the message (success or error)
};

export default CriteriaForm;