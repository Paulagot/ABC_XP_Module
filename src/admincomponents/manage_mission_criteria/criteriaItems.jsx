import React from 'react';
import PropTypes from 'prop-types';


/**
 * CriteriaItem Component
 * This component renders an individual criterion item in the list and provides the delete functionality.
 * 
 * Props:
 * - criteria (object): The criterion object containing its data.
 * - onCriteriaDelete (function): Function to trigger the delete action for the criterion.
 * - bites (array): List of bites available for selection.
 * - subcategories (array): List of subcategories available for selection.
 */
const CriteriaItem = ({ criteria, onCriteriaDelete, bites, subcategories }) => {
    /**
     * Trigger the deletion process for this criterion.
     */
    const handleDelete = () => {
        // Directly call the function to show the UI-based confirmation dialog
        onCriteriaDelete(criteria.criteria_id);
    };

    return (
        <tr>
            <td>{criteria.criteria_type}</td>
            <td>{criteria.condition_type}</td>
            <td>{criteria.bite_name || 'N/A'}</td>
            <td>{criteria.subcategory_name || 'N/A'}</td>
            <td>{criteria.lp_value || 'N/A'}</td>
            <td>
                {/* Delete button that triggers the confirmation dialog */}
                <button onClick={handleDelete}>Delete</button>
            </td>
        </tr>
    );
};

// PropTypes validation
CriteriaItem.propTypes = {
    criteria: PropTypes.object.isRequired,  // The criterion data
    onCriteriaDelete: PropTypes.func.isRequired,  // Function to trigger the delete action
    bites: PropTypes.array.isRequired,  // List of bite options for display
    subcategories: PropTypes.array.isRequired,  // List of subcategory options for display
};

export default CriteriaItem;