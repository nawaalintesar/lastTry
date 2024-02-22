
import styles from "./DeleteProject.module.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useCallback, useEffect, dispatch } from "react";
import { useNavigate } from "react-router-dom";
const DeleteProject = ({ projectID, onClose }) => {

  const user = useAuthContext();
  const navigate = useNavigate();

  const onExploreButtonContainerClick = useCallback(() => {
    navigate("/Projects");
  }, [navigate]);

  const handleDelete = async () => {

    try {
      console.log("We deleitng");
      console.log("ID IS", projectID);
      const response = await fetch(`/api/projects/${projectID}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.user.token}` }

      });

      const responseData = await response.json();

      if (response.ok) {
        navigate("/Projects");
      } else {
        console.error('Error deleting projec:', response.statusText);

      }
    } catch (error) {
      console.error('Error deleingg projects:', error);
    }
  };

  return (
    <div className={styles.deleteProject}>
      <div className={styles.deleteProjectL}>
        <div className={styles.areYouSure}>
          Are you sure you want to Delete project?
        </div>
        <div

          className={styles.explorebutton}
          onClick={() => {
            onClose();
            onExploreButtonContainerClick();
          }}
        >
          <div className={styles.yes} onClick={handleDelete}>Yes</div>
        </div>
        <button className={styles.explorebutton1} onClick={onClose}>
          <div className={styles.no}>No</div>
        </button>
        <img
          className={styles.pagecrossIcon}
          alt=""
          src="/pagecross.svg"
          onClick={onClose}
        />
        <div className={styles.thisActionCannot}>
          This action cannot be reversed.
        </div>
      </div>
    </div>
  );
};

export default DeleteProject;
