import { useMemo } from "react";
import styles from "./ProjectFrame.module.css";
import { useState, useCallback, useEffect } from "react";
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useProjectsContext } from "../hooks/useProjectsContext.js";
import DeleteProject from "../components/DeleteProject";
import PortalPopup from "../components/PortalPopup";
import React from "react";

const ProjectFrame = ({
  project,
  edited5MinAgo,
  project1,
  editMinus,
  j,
  showEditMinus,
  projectFrameWidth,
  projectFramePosition,
  projectFrameTop,
  projectFrameLeft,
  onclick
}) => {
  const [isDeleteProjectOpen, setDeleteProjectOpen] = useState(false);

  const openDeleteProject = useCallback(() => {
    setDeleteProjectOpen(true);
  }, []);

  const closeDeleteProject = useCallback(() => {
    setDeleteProjectOpen(false);
  }, []);

  // Function to generate random color
  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getRandomColor = () => {
    const letters = '89ABCDEF';
    let color = '#';

    do {
      color = '#'; // Reset color
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
      }
    } while (!isLightColor(color));

    return color;
  }

  // Function to check if a color is light
  function isLightColor(color) {
    const hex = color.replace('#', '');
    const rgb = parseInt(hex, 16); // Convert hex to decimal
    const r = (rgb >> 16) & 0xff; // Extract red component
    const g = (rgb >> 8) & 0xff; // Extract green component
    const b = (rgb >> 0) & 0xff; // Extract blue component

    // Calculate luminance (perceived brightness)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5; // Return true if the color is light
  }

  // Memoize the random color for each project
  const projectBoxBackground = useMemo(() => getRandomColor(), []);

  return (
    <>
      <div className={styles.projectframe} style={{ width: projectFrameWidth, position: projectFramePosition, top: projectFrameTop, left: projectFrameLeft }}>
        <div onClick={onclick}>
          <div className={styles.edited5Min}>Updated {formatDistanceToNow(new Date(project.createdAt), {addSuffix: true})}</div>
          <div className={styles.project1} onClick={onclick}>{project1}</div>
          <div className={styles.projectbox} style={{ background: projectBoxBackground }} onClick={onclick}></div>
        </div>
        
        {!showEditMinus && (
          <img
            className={styles.editMinus}
            alt=""
            src={"/edit--minus@2x.png"}
            onClick={openDeleteProject}
          />
        )}

        <div className={styles.j}>{j}</div>
      </div>
      
      {isDeleteProjectOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeDeleteProject}
        >
          <DeleteProject projectID={project._id} onClose={closeDeleteProject} />
        </PortalPopup>
      )}
    </>
  );
};

export default ProjectFrame;
