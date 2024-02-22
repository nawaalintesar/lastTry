import { useState, useCallback } from "react";
import DeleteProject from "./DeleteProject";
import PortalPopup from "./PortalPopup";
import ProjectFrame from "./ProjectFrame";
import styles from "./FormContainer2.module.css";

const FormContainer2 = () => {
  const [isDeleteProjectOpen, setDeleteProjectOpen] = useState(false);

  const openDeleteProject = useCallback(() => {
    setDeleteProjectOpen(true);
  }, []);

  const closeDeleteProject = useCallback(() => {
    setDeleteProjectOpen(false);
  }, []);

  return (
    <>
      <div className={styles.projects}>
        <ProjectFrame
          edited5MinAgo="Edited 10 min ago"
          project1="Project 2"
          editMinus="/edit--minus@2x.png"
          j="J"
          showEditMinus
          projectFrameWidth="1099px"
          projectFramePosition="absolute"
          projectFrameTop="0px"
          projectFrameLeft="0px"
          projectBoxBackground="linear-gradient(139.01deg, #e37540, #d24d3c 93.23%)"
          projectBoxBoxShadow="0px 4px 4px rgba(0, 0, 0, 0.35)"
          editMinusObjectFit="cover"
        />

        <img
          className={styles.editMinus}
          alt=""
          src="/edit--minus@2x.png"
          onClick={openDeleteProject}
        />
      </div>
      {isDeleteProjectOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeDeleteProject}
        >
          <DeleteProject onClose={closeDeleteProject} />
        </PortalPopup>
      )}
    </>
  );
};

export default FormContainer2;
