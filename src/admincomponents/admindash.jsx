import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../context/protected_route.jsx'
import Header from './adminheader';
import ButtonSection from './adminbuttons';
import ManageMissions from './manage_missions/managemissions.jsx'
import ManageUsers from './manageuser'
import AddNewUser from './addnewuser';
import ManageBites from './manage_bytes/managebites.jsx';
import ManageSubCategory from './managesubcategory';
import ManagePartner from './managesponsors';
import ManageChain from './manage_chains.jsx';
import ManageCriteria from './manage_mission_criteria/managecriteria.jsx';
import AdminLandingPageEditor from './manage_pages/AdminLandingPageEditor.jsx';
import ReportTable from './bytes_reports.jsx'
import axios from 'axios';
import MissionsReportTable from './missions_report.jsx';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  // Popup state management
  const [displayUserPopup, setDisplayUserPopup] = useState(false);
  const [displayUserForm, setDisplayUserForm] = useState(false);
  const [displayBitesPopup, setDisplayBitesPopup] = useState(false);
  const [displaySubCategoryPopup, setDisplaySubCategoryPopup] = useState(false);
  const [displayMissionsPopup, setDisplayMissionsPopup] = useState(false);
  const [displayPartnerPopup, setDisplayPartnerPopup] = useState(false);
  const [displayChainPopup, setDisplayChainPopup] = useState(false);
  const [displayCriteriaPopup, setDisplayCriteriaPopup] = useState(false);
  const [displayLandingPageEditor, setDisplayLandingPageEditor] = useState(false);
 

 

  // Toggle popup visibility
  const togglePopup = (popupType) => {
    

    switch (popupType) {
      case 'userPopup':
        setDisplayUserPopup((prevState) => !prevState);
        setDisplayUserForm(false);
        break;
      case 'userForm':
        setDisplayUserForm((prevState) => !prevState);
        break;
      case 'bitesPopup':
        setDisplayBitesPopup((prevState) => !prevState);
        break;
      case 'subCategoryPopup':
        setDisplaySubCategoryPopup((prevState) => !prevState);
        break;
      case 'missionsPopup':
        setDisplayMissionsPopup((prevState) => !prevState);
        break;
      case 'chainPopup':
        setDisplayChainPopup((prevState) => !prevState);
        break;
      case 'criteriaPopup':
        setDisplayCriteriaPopup((prevState) => !prevState);
        break;
      case 'landingPageEditor':
        setDisplayLandingPageEditor((prevState) => !prevState);
        break;
      case 'partnerPopup':
        setDisplayPartnerPopup((prevState) => !prevState);
        break;
      default:
        console.warn(`Unknown popup type: ${popupType}`); // Catch unexpected cases
        break;
    }
  };

  // Check if any popup is currently displayed
  const isPopupDisplayed = [
    displayUserPopup,
    displayUserForm,
    displayBitesPopup,
    displaySubCategoryPopup,
    displayMissionsPopup,
    displayPartnerPopup,
    displayChainPopup,
    displayCriteriaPopup,
    displayLandingPageEditor,
  ].some(Boolean);

 
  
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/fetch-data`);
      console.log('Fetched data:', response.data);
      alert('Dashboard data fetched successfully'); // Simple feedback
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Check console for details.');
    }
  };

  

  return (
   < ProtectedRoute role="admin">
    <div>
      <Header />     

      {/* Conditionally render ButtonSection */}
      {!isPopupDisplayed && <ButtonSection togglePopup={togglePopup} />}

      {/* Conditionally render Unpublished Tables */}
      {!isPopupDisplayed && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '100px',
            gap: '10px',
          }}
        >
          
          <ReportTable />
         < MissionsReportTable/>
        </div>
      )}

      {/* Manage Missions Popup */}
      {displayMissionsPopup && (
      <ManageMissions
      closePopup={() => togglePopup('missionsPopup')}
      openManageChains={() => togglePopup('chainPopup')}
      openManageSponsors={() => togglePopup('partnerPopup')}
      openManageSubcategories={() => togglePopup('subCategoryPopup')}
      openAddCriteria={() => togglePopup('criteriaPopup')}
      openLandingPageEditor={() => togglePopup('landingPageEditor')}
    />
     
      )}

      {/* Manage Criteria Popup */}
      {displayCriteriaPopup && (
        <ManageCriteria
          closePopup={() => togglePopup('criteriaPopup')}
        
        />
      )}

      {/* Admin Landing Page Editor Popup */}
      {displayLandingPageEditor && (
        <AdminLandingPageEditor
          closePopup={() => togglePopup('landingPageEditor')}
          
        />
      )}

      {/* Other popups */}
      {displayUserPopup && (
        <ManageUsers
          closePopup={() => togglePopup('userPopup')}
          openAddNewUser={() => togglePopup('userForm')}
        />
      )}

      {displayUserForm && <AddNewUser closePopup={() => togglePopup('userForm')} />}

      {displayBitesPopup && <ManageBites closePopup={() => togglePopup('bitesPopup')} />}

      {displaySubCategoryPopup && (
        <ManageSubCategory closePopup={() => togglePopup('subCategoryPopup')} />
      )}

      {displayPartnerPopup && (
        <ManagePartner closePopup={() => togglePopup('partnerPopup')} />
      )}

      {displayChainPopup && <ManageChain closePopup={() => togglePopup('chainPopup')} />}
    </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
