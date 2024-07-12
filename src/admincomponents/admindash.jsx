import React, { useState } from 'react';
import Header from './adminheader';
import ButtonSection from './adminbuttons';
import AddNewMission from './addnewmission'
import Manage_missions from './managemissions';
import ManageUsers from './manageuser'
import AddNewUser from './addnewuser';
import ManageBites from './managebites';
import AddNewBite from './addnewbite';
import ManageSubCategory from './managesubcategory';
import AddNewSubCategory from './addnewsubcategory';
import ManagePartner from './managepartners';
import AddNewPartner from './addnewpartner';


const AdminDashboard = () => {
  // State to manage visibility of various popups and forms
  const [displayUserPopup, setDisplayUserPopup] = useState(false);
  const [displayUserForm, setDisplayUserForm] = useState(false);
  const [displayBitesPopup, setDisplayBitesPopup] = useState(false);
  const [displayBitesForm, setDisplayBitesForm] = useState(false);
  const [displaySubCategoryPopup, setDisplaySubCategoryPopup] = useState(false);
  const [displaySubCategoryForm, setDisplaySubCategoryForm] = useState(false);
  const [displayMissionsPopup, setDisplayMissionsPopup] = useState(false);
  const [displayMissionsForm, setDisplayMissionsForm] = useState(false);
  const [displayPartnerPopup, setDisplayPartnerPopup] = useState(false);
  const [displayPartnerForm, setDisplayPartnerForm] = useState(false);

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
      case 'bitesForm':
        setDisplayBitesForm(prevState => !prevState);
        break;
      case 'subCategoryPopup':
        setDisplaySubCategoryPopup(prevState => !prevState);
        break;
      case 'subCategoryForm':
        setDisplaySubCategoryForm(prevState => !prevState);
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
      case 'partnerForm':
        setDisplayPartnerForm(prevState => !prevState);
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

  const validateBitesForm = (e) => {
    e.preventDefault();
    // Your bites form validation logic
  };

  const validateSubCategoryForm = (e) => {
    e.preventDefault();
    // Your subcategory form validation logic
  };

  const validateMissionsForm = (e) => {
    e.preventDefault();
    // Your missions form validation logic
  };

  const validatePartnerForm = (e) => {
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
       openAddNewBite={() => togglePopup('bitesForm')}
       />
      )}

      {/* Conditional rendering of the Bites Form */}
      {displayBitesForm && (
        <AddNewBite 
        closePopup={() => togglePopup('bitesForm')}
        validateBiteForm={validateForm} />
      )}

      {/* Conditional rendering of the Sub-Category Popup */}
      {displaySubCategoryPopup && (
        <ManageSubCategory 
        closePopup={() => togglePopup('subCategoryPopup')}
       openAddNewSubCategory={() => togglePopup('subCategoryForm')}
       />
       
      )}

      {/* Conditional rendering of the Sub-Category Form */}
      {displaySubCategoryForm && (
      <AddNewSubCategory
      closePopup={() => togglePopup('subCategoryForm')} 
      validateMissionsForm={validateSubCategoryForm}  />
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
          openAddNewPartner={() => togglePopup('partnerForm')}/>
      )}

      {/* Conditional rendering of the Partner Form */}
      {displayPartnerForm && (
        <AddNewPartner
        closeForm={() => togglePopup('partnerForm')} 
        validatePartnerForm={validatePartnerForm} 
      />
        
      )}
    </div>
  );
};

export default AdminDashboard;


