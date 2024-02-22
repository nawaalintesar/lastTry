// import { useState, useCallback } from "react";
import { TextField, InputAdornment, Icon, IconButton } from "@mui/material";
import ProfileUpdateConfirmationL from "./ProfileUpdateConfirmationL";
import PortalPopup from "./PortalPopup";
import ProfileDeleteL from "./ProfileDeleteL";
import styles from "./UserUpdate.module.css";
import { useEffect, dispatch, useState, useCallback } from "react";

import { useAuthContext } from "../hooks/useAuthContext";

const UserUpdate = ({ profile }) => {

  const user = useAuthContext();
  const [
    isProfileUpdateConfirmationLPopupOpen,
    setProfileUpdateConfirmationLPopupOpen,
  ] = useState(false);
  const [isProfileDeleteLPopupOpen, setProfileDeleteLPopupOpen] =
    useState(false);

  const openProfileUpdateConfirmationLPopup = useCallback(() => {
    setProfileUpdateConfirmationLPopupOpen(true);
  }, []);

  const closeProfileUpdateConfirmationLPopup = useCallback(() => {
    setProfileUpdateConfirmationLPopupOpen(false);
  }, []);

  const openProfileDeleteLPopup = useCallback(() => {
    setProfileDeleteLPopupOpen(true);
  }, []);

  const closeProfileDeleteLPopup = useCallback(() => {
    setProfileDeleteLPopupOpen(false);
  }, []);

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [userEmail, setUserEmail] = useState(profile.userEmail);
  const { dispatch } = useAuthContext();
  const handleUpdate = async () => {
    // Fetch updated data from input fields
    const updatedData = {
      firstName,
      lastName,
      userEmail,
      // Add other fields as needed
    };

    console.log("USER IN UPDATE", user.user.token);
    // Dispatch an action to update the context state
    dispatch({ type: 'UPDATE_ACCOUNT_INFO', payload: updatedData });

    try {
      // Send a PATCH request to the server to update the database
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.user.token}`,
        },
        body: JSON.stringify(updatedData),

      });

      if (response.ok) {
        // Fetch the updated profile after the update
        const fetchResponse = await fetch('/api/user/', {
          headers: { 'Authorization': `Bearer ${user.user.token}` }
        });
        const json = await fetchResponse.json();

        if (fetchResponse.ok) {
          // Update the context with the latest profile data
          dispatch({ type: 'GET_PROFILE', payload: json });
        }
      } else {
        // Handle error if the update request fails
        console.error('Error updating data:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  return (
    <>
      <div className={styles.firstNameGroupParent}>
        <div className={styles.firstNameGroup}>
          <TextField
            className={styles.frame}
            color="secondary"
            // label={profile.firstName}
            name="fname"
            placeholder={profile.firstName}
            sx={{ width: 640 }}
            variant="filled"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <div className={styles.firstName}>First Name</div>
        </div>
        <div className={styles.lastNameGroup}>
          <div className={styles.lastName}>Last Name</div>
          <TextField
            className={styles.frame1}
            color="secondary"
            // label={profile.lastName}
            name="lname"
            placeholder={profile.lastName}
            sx={{ width: 640 }}
            variant="filled"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className={styles.groupemailAddressGroup}>
          <div className={styles.emailAddress}>Email address</div>
          <TextField
            className={styles.frame2}
            color="secondary"
            // label={profile.userEmail}
            placeholder={profile.userEmail}
            name="Email"
            sx={{ width: 640 }}
            variant="filled"
            type="text"
            onChange={(e) => setUserEmail(e.target.value)}
            disabled
          />
        </div>

        <div className={styles.updateButtonGroup}>
          <div className={styles.button} onClick={handleUpdate}>
            <div className={styles.update} onClick={openProfileUpdateConfirmationLPopup}> <div className={styles.update}>Update</div> </div>
          </div>
        </div>
        <div className={styles.deleteAccountGroup}>
          <div className={styles.doYouWish}>
            Do you wish to delete your account?
          </div>
          <button
            className={styles.clickHere}
            onClick={openProfileDeleteLPopup}
          >
            Click Here
          </button>
        </div>
      </div>
      {isProfileUpdateConfirmationLPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeProfileUpdateConfirmationLPopup}
        >
          <ProfileUpdateConfirmationL
            onClose={closeProfileUpdateConfirmationLPopup}
          />
        </PortalPopup>
      )}
      {isProfileDeleteLPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeProfileDeleteLPopup}
        >
          <ProfileDeleteL onClose={closeProfileDeleteLPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default UserUpdate;