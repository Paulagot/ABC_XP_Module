import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CriteriaList from './criteriaLists';



/**
 * CriteriaSection Component
 * This component displays a list of criteria for a selected mission and handles actions like deleting or updating criteria.
 * 
 * Props:
 * - criteriaList (array): List of criteria to display.
 * - handleCriteriaUpdate (function): Function to handle criteria updates.
 * - handleCriteriaDelete (function): Function to handle deleting a criterion.
 * - bites (array): List of bites available for selection.
 * - subcategories (array): List of subcategories available for selection.
 */
const CriteriaSection = ({
  criteriaList,
  handleCriteriaUpdate,
  handleCriteriaDelete,  // Function passed from parent to handle deletion
  bites,  
  subcategories,
}) => {
  return (
    <>
      {/* Display list of criteria if available */}
      {Array.isArray(criteriaList) && criteriaList.length > 0 ? (
        <CriteriaList
          criteriaList={criteriaList}
          onCriteriaUpdate={handleCriteriaUpdate}
          onCriteriaDelete={handleCriteriaDelete}  // Pass down the delete handler to the CriteriaList component
          bites={bites}  
          subcategories={subcategories}  
        />
      ) : (
        <p>No criteria found for this mission.</p>
      )}
    </>
  );
};

// PropTypes validation
CriteriaSection.propTypes = {
  criteriaList: PropTypes.array.isRequired,  // List of criteria objects
  handleCriteriaUpdate: PropTypes.func.isRequired,  // Function to update the criteria list
  handleCriteriaDelete: PropTypes.func.isRequired,  // Function to delete a criterion
  bites: PropTypes.array.isRequired,  // List of bite options for selection
  subcategories: PropTypes.array.isRequired,  // List of subcategory options for selection
};

export default CriteriaSection;