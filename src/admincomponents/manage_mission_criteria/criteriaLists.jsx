


import React from 'react';
import CriteriaItem from './criteriaItems';
import PropTypes from 'prop-types';

const CriteriaList = ({ criteriaList, onCriteriaDelete, bites, subcategories }) => {
  return (
    <div className="criteriaList">
      <h3>Criteria for Selected Mission</h3>
      {Array.isArray(criteriaList) && criteriaList.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', padding: '8px' }}>Criteria Type</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Match Type</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Bite Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Subcategory Name</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>LP Required</th>
              <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {criteriaList.map((criteria) => (
              <CriteriaItem
                key={criteria.criteria_id}
                criteria={criteria}
                onCriteriaDelete={onCriteriaDelete}
                bites={bites}
                subcategories={subcategories}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <p>No criteria found for this mission.</p>
      )}
    </div>
  );
};

CriteriaList.propTypes = {
  criteriaList: PropTypes.array.isRequired,
  onCriteriaDelete: PropTypes.func.isRequired,
  bites: PropTypes.array.isRequired,
  subcategories: PropTypes.array.isRequired,
};

export default CriteriaList;
