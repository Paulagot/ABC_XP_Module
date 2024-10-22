import React, { useState, useEffect } from 'react';
import Header from './adminheader';
import ButtonSection from './adminbuttons';
import ManageMissions from './manage_missions/managemissions.jsx'
import ManageUsers from './manageuser'
import AddNewUser from './addnewuser';
import ManageBites from './managebites';
import ManageSubCategory from './managesubcategory';
import ManagePartner from './managesponsors';
import ManageChain from './manage_chains.jsx';
import ManageCriteria from './manage_mission_criteria/managecriteria.jsx';
import UnpublishedBitesTable from './unpublishedbytes.jsx';
import UnpublishedMissionsTable from './unpublishedmissions.jsx';
import axios from 'axios';


const AdminDashboard = () => {
  useEffect(() => {
    axios.get('http://16.171.3.129:3000/api/fetch-data')
      .then(response => {
        console.log('System function data fetched successfully:', response.data);
      })
      .catch(error => {
        console.error('Error fetching system function data:', error);
      });
  }, []);

  const [displayUserPopup, setDisplayUserPopup] = useState(false);
  const [displayUserForm, setDisplayUserForm] = useState(false);
  const [displayBitesPopup, setDisplayBitesPopup] = useState(false);
  const [displaySubCategoryPopup, setDisplaySubCategoryPopup] = useState(false);
  const [displayMissionsPopup, setDisplayMissionsPopup] = useState(false); 
  const [displayPartnerPopup, setDisplayPartnerPopup] = useState(false);
  const [displayChainPopup, setDisplayChainPopup] = useState(false);
  const [displayCriteriaPopup, setDisplayCriteriaPopup] = useState(false);

  const togglePopup = (popupType) => {
    switch (popupType) {
      case 'userPopup':
        setDisplayUserPopup(prevState => !prevState);
        setDisplayUserForm(false); 
        break;
      case 'userForm':
        setDisplayUserForm(prevState => !prevState);
        break;
      case 'bitesPopup':
        setDisplayBitesPopup(prevState => !prevState);
        break;
      case 'subCategoryPopup':
        setDisplaySubCategoryPopup(prevState => !prevState);
        break;
      case 'missionsPopup':
        setDisplayMissionsPopup(prevState => !prevState);
        break;
      case 'chainPopup':
        setDisplayChainPopup(prevState => !prevState);
        break;
      case 'criteriaPopup':
        setDisplayCriteriaPopup(prevState => !prevState);
        break;
      case 'partnerPopup':
        setDisplayPartnerPopup(prevState => !prevState);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <Header />
      <ButtonSection togglePopup={togglePopup} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', gap: '100px'}}>
        <UnpublishedBitesTable />
        <UnpublishedMissionsTable />
      </div>

      {displayMissionsPopup && (
        <ManageMissions 
          closePopup={() => togglePopup('missionsPopup')}
          openManageChains={() => togglePopup('chainPopup')}
          openManageSponsors={() => togglePopup('partnerPopup')}
          openManageSubcategories={() => togglePopup('subCategoryPopup')}
        />
      )}

      {displayUserPopup && (
        <ManageUsers closePopup={() => togglePopup('userPopup')} openAddNewUser={() => togglePopup('userForm')} />
      )}

      {displayUserForm && (
        <AddNewUser closePopup={() => togglePopup('userForm')} />
      )}

      {displayBitesPopup && (
        <ManageBites closePopup={() => togglePopup('bitesPopup')} />
      )}

      {displaySubCategoryPopup && (
        <ManageSubCategory closePopup={() => togglePopup('subCategoryPopup')} />
      )}

      {displayPartnerPopup && (
        <ManagePartner closePopup={() => togglePopup('partnerPopup')} />
      )}

      {displayChainPopup && (
        <ManageChain closePopup={() => togglePopup('chainPopup')} />
      )}

      {displayCriteriaPopup && (
        <ManageCriteria closePopup={() => togglePopup('criteriaPopup')} />
      )}
    </div>
  );
};

export default AdminDashboard;