import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CriteriaList from './criteriaLists';


const CriteriaSection = ({
  criteriaList,
  handleCriteriaUpdate,
  handleCriteriaDelete,
  bites,  // Add bites prop
  subcategories,  // Add subcategories prop
}) => {
  return (
    <>
      {Array.isArray(criteriaList) && criteriaList.length > 0 ? (
        <CriteriaList
          criteriaList={criteriaList}
          onCriteriaUpdate={handleCriteriaUpdate}
          onCriteriaDelete={handleCriteriaDelete}
          bites={bites}  // Pass bites down
          subcategories={subcategories}  // Pass subcategories down
        />
      ) : (
        <p>No criteria found for this mission.</p>
      )}
    </>
  );
};

CriteriaSection.propTypes = {
  criteriaList: PropTypes.array.isRequired,
  handleCriteriaUpdate: PropTypes.func.isRequired,
  handleCriteriaDelete: PropTypes.func.isRequired,
  bites: PropTypes.array.isRequired,  // Define bites prop type
  subcategories: PropTypes.array.isRequired,  // Define subcategories prop type
};

export default CriteriaSection;







