import React, { useState } from 'react';
import Header from './adminheader';
import ButtonSection from './adminbuttons';

import Manage_missions from './manage_missions/managemissions';
import ManageUsers from './manageuser'
import AddNewUser from './addnewuser';
import ManageBites from './managebites';
import ManageSubCategory from './managesubcategory';
import ManagePartner from './managesponsors';
import ManageChain from './manage_chains.jsx';
import ManageCriteria from './manage_mission_criteria/managecriteria.jsx';


const AdminDashboard = () => {
  // State to manage visibility of various popups and forms
  const [displayUserPopup, setDisplayUserPopup] = useState(false);
  const [displayUserForm, setDisplayUserForm] = useState(false);
  const [displayBitesPopup, setDisplayBitesPopup] = useState(false);
  const [displaySubCategoryPopup, setDisplaySubCategoryPopup] = useState(false);
  const [displayMissionsPopup, setDisplayMissionsPopup] = useState(false); 
  const [displayPartnerPopup, setDisplayPartnerPopup] = useState(false);
  const [displayChainPopup, setDisplayChainPopup] = useState(false);
  const [displayCriteriaPopup, setDisplayCriteriaPopup] = useState(false);
 

  // Function to toggle visibility of different popups and forms
  const togglePopup = (popupType) => {
    switch (popupType) {
      case 'userPopup':
        setDisplayUserPopup(prevState => !prevState);
        setDisplayUserForm(false); // Ensure the form is closed when the popup opens
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



  // Start of the return statement
  return (
    <div>
      <Header />
      <ButtonSection togglePopup={togglePopup} />

      {/* Conditional rendering of the User Popup */}
      {displayUserPopup && (
         <ManageUsers
         closePopup={() => togglePopup('userPopup')}
         openAddNewUser={() => togglePopup('userForm')}
       />
      )}

      {/* Conditional rendering of the User Form */}
      {displayUserForm && (
        <AddNewUser
        closePopup={() => togglePopup('userForm')}
        validateUserForm={validateForm} 
      />
      )}

      {/* Conditional rendering of the Bites Popup */}
      {displayBitesPopup && (
       <ManageBites 
       closePopup={() => togglePopup('bitesPopup')}
       
       />
      )}

      {/* Conditional rendering of the Sub-Category Popup */}
      {displaySubCategoryPopup && (
        <ManageSubCategory 
        closePopup={() => togglePopup('subCategoryPopup')}
       
       />
       
      )}
    
      {/* Conditional rendering of the Missions Popup */}
      {displayMissionsPopup && (
        <Manage_missions
          closePopup={() => togglePopup('missionsPopup')}
          
        />
      )}
    

      {/* Conditional rendering of the Partner Popup */}
      {displayPartnerPopup && (
       <ManagePartner 
          closePopup={() => togglePopup('partnerPopup')}
          />
      )}

         {/* Conditional rendering of the chain Popup */}
         {displayChainPopup && (
       <ManageChain 
          closePopup={() => togglePopup('chainPopup')}
          />
      )}

          {/* Conditional rendering of the criteria Popup */}
          {displayCriteriaPopup && (
       <ManageCriteria 
          closePopup={() => togglePopup('criteriaPopup')}
          />
      )}
    
        
     
    </div>
  );
};

export default AdminDashboard;


