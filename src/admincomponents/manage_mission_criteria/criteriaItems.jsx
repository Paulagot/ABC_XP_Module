import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// handles deletion of mission criteria and displays the table of criteria for the selected mission


const CriteriaItem = ({ criteria, onCriteriaDelete, bites, subcategories }) => {
    const biteName = bites?.find(bite => bite.bite_id === criteria.bite_id)?.name || 'N/A';
    const subcategoryName = subcategories?.find(subcategory => subcategory.subcategory_id === criteria.subcategory_id)?.name || 'N/A';

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this criterion?')) {
            onCriteriaDelete(criteria.criteria_id);
        }
    };

    return (
        <tr>
            <td style={{ border: '1px solid black', padding: '8px' }}>{criteria.criteria_type}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{criteria.condition_type}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{biteName}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{subcategoryName}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{criteria.lp_value}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={handleDelete}>Delete</button>
            </td>
        </tr>
    );
};

export default CriteriaItem;