


import React from 'react';
import CriteriaItem from './criteriaItems';
import PropTypes from 'prop-types';

/**
 * CriteriaList Component
 * This component is responsible for displaying a table of criteria for a selected mission.
 * It iterates over the list of criteria and renders each one using the CriteriaItem component.
 * 
 * Props:
 * - criteriaList (array): Array of criteria objects to display in the table.
 * - onCriteriaDelete (function): Function to handle the deletion of a criterion. 
 * - bites (array): List of bite options to display bite names.
 * - subcategories (array): List of subcategory options to display subcategory names.
 */
const CriteriaList = ({ criteriaList, onCriteriaDelete, bites, subcategories }) => {
  return (
    <div className="criteriaList">
      <h3>Criteria for Selected Mission</h3>
      {/* Check if there are any criteria to display */}
      {Array.isArray(criteriaList) && criteriaList.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {/* Table Headers for displaying different attributes of criteria */}
              <th style={{ border: '1px solid black', padding: '8px' }}>Criteria Type</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Match Type</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Bite Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Subcategory Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>LP Required</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Map over criteriaList and render a CriteriaItem component for each criterion */}
            {criteriaList.map((criteria) => (
              <CriteriaItem
                key={criteria.criteria_id}  // Unique key for each child component
                criteria={criteria}  // Pass down the criterion data
                onCriteriaDelete={onCriteriaDelete}  // Pass down the delete function to handle deletions
                bites={bites}  // Pass down the list of bites for display
                subcategories={subcategories}  // Pass down the list of subcategories for display
              />
            ))}
          </tbody>
        </table>
      ) : (
        // Display a message if there are no criteria available
        <p>No criteria found for this mission.</p>
      )}
    </div>
  );
};

// PropTypes validation
CriteriaList.propTypes = {
  criteriaList: PropTypes.array.isRequired,  // The array of criteria objects to be displayed
  onCriteriaDelete: PropTypes.func.isRequired,  // Function to handle deletion of a criterion
  bites: PropTypes.array.isRequired,  // Array of bites for dropdown options
  subcategories: PropTypes.array.isRequired,  // Array of subcategories for dropdown options
};

export default CriteriaList;