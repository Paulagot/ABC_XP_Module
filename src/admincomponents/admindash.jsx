import React, { useState } from 'react';
import Header from './adminheader';
import ButtonSection from './adminbuttons';
import AddNewMission from './addnewmission'
import Manage_missions from './managemissions';
import ManageUsers from './manageuser'
import AddNewUser from './addnewuser';
import ManageBites from './managebites';
import ManageSubCategory from './managesubcategory';
import ManagePartner from './managesponsors';



const AdminDashboard = () => {
  // State to manage visibility of various popups and forms
  const [displayUserPopup, setDisplayUserPopup] = useState(false);
  const [displayUserForm, setDisplayUserForm] = useState(false);
  const [displayBitesPopup, setDisplayBitesPopup] = useState(false);
  const [displaySubCategoryPopup, setDisplaySubCategoryPopup] = useState(false);
  const [displayMissionsPopup, setDisplayMissionsPopup] = useState(false);
  const [displayMissionsForm, setDisplayMissionsForm] = useState(false);
  const [displayPartnerPopup, setDisplayPartnerPopup] = useState(false);
 

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
        setDisplayMissionsForm(false); // Ensure the form is closed when the popup opens
        break;
      case 'missionsForm':
        setDisplayMissionsForm(prevState => !prevState);
        
        break;
      case 'partnerPopup':
        setDisplayPartnerPopup(prevState => !prevState);
        break;
        default:
        break;
    }
  };

  // Function placeholders for form validation
  const validateForm = (e) => {
    e.preventDefault();
    // Your form validation logic
  };

  const validateBite = (e) => {
    e.preventDefault();
    // Your bites form validation logic
  };

  const validateSubCategory = (e) => {
    e.preventDefault();
    // Your subcategory form validation logic
  };

  const validateMissionsForm = (e) => {
    e.preventDefault();
    // Your missions form validation logic
  };

  const validatePartner = (e) => {
    e.preventDefault();
    // Your partner form validation logic
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
          openAddNewMission={() => togglePopup('missionsForm')}
        />
      )}
      {/* Conditional rendering of add new missions */}
      {displayMissionsForm && (
              <AddNewMission 
                closeForm={() => togglePopup('missionsForm')} 
                validateMissionsForm={validateMissionsForm} 
              />
            )}

      {/* Conditional rendering of the Partner Popup */}
      {displayPartnerPopup && (
       <ManagePartner 
          closePopup={() => togglePopup('partnerPopup')}
          />
      )}

    
        
     
    </div>
  );
};

export default AdminDashboard;


