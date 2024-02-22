import { useCallback } from "react";
import styles from "./LogOutPopOutL.module.css";

import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";



const LogOutPopOutL = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useLogout()

  const handleClick = () => {
    logout()
    navigate("/LogIn");

  }


  return (
    <div className={styles.logoutpopoutL}>
      <div className={styles.areYouSure}>Are you sure you want to log out?</div>
      <div
        className={styles.explorebutton}
        onClick={handleClick}
      >
        <div className={styles.yes} onClick={handleClick}>Yes</div>
      </div>
      <button className={styles.explorebutton1} onClick={onClose}>
        <div className={styles.no} onClick={onClose}>No</div>
      </button>
      <img
        className={styles.pagecrossIcon}
        alt=""
        src="/pagecross1.svg"
        onClick={onClose}
      />
    </div>
  );
};

export default LogOutPopOutL;
