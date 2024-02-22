import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProfileDeleteL.module.css";
import { useAuthContext } from "../hooks/useAuthContext";

const ProfileDeleteL = ({ onClose }) => {
  const navigate = useNavigate();
  const {user, dispatch}=useAuthContext();
  const onFrameContainerClick = useCallback(() => {
    
    navigate("/LogIn");
  }, [navigate]);

  const handleDelete= async () => {
    // logout()
    // navigate("/LogIn");
    const delete_result = await fetch(`/api/user/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    if (delete_result.ok) {
      console.log("Deleted!");
      dispatch({type: 'DELETE_ACCOUNT'});

    }
    else {
      console.log(user);
    }

  }

  return (
    <div className={styles.profiledeleteL}>
      <div className={styles.profiledeleteLChild} />
      <div className={styles.areYouSureContainer}>
        <span className={styles.areYouSureContainer1}>
          <p className={styles.areYouSure}>
            Are you sure you want to delete your account?
          </p>
          <p className={styles.areYouSure}>
            Your progress will not be saved and this action cannot be reversed.
          </p>
        </span>
      </div>
      <div className={styles.deleteAccount}>Delete Account?</div>
      <img
        className={styles.pagecrossIcon}
        alt=""
        src="/pagecross.svg"
        onClick={onClose}
      />
      <div
        className={styles.explorebuttonWrapper}
        onClick={onFrameContainerClick}
      >
        <button className={styles.explorebutton} onClick={handleDelete} >
          <div className={styles.yes} onClick={handleDelete}>Yes</div>
        </button>
      </div>
      <button className={styles.explorebutton1} onClick={onClose}>
        <div className={styles.yes} onClick={onClose}>No</div>
      </button>
    </div>
  );
};

export default ProfileDeleteL;
