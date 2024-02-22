import { useState, useCallback } from "react";
import ConfirmEnrollment from "./ConfirmEnrollment";
import PortalPopup from "./PortalPopup";
import EnrollPopUp from "./EnrollPopUp";
import AvailableLanguages from "./AvailableLanguages";
import { useNavigate } from "react-router-dom";
import styles from "./TutorialForm.module.css";

const TutorialForm = ({tutorial}) => {
  const [isConfirmEnrollmentPopupOpen, setConfirmEnrollmentPopupOpen] =
    useState(false);
    
  const [isEnrollPopUpOpen, setEnrollPopUpOpen] = useState(false);
  const navigate = useNavigate();

  const openEnrollPopUp = useCallback(() => {
    setEnrollPopUpOpen(true);
  }, []);

  const closeEnrollPopUp = useCallback(() => {
    setEnrollPopUpOpen(false);
  }, []);

  const openConfirmEnrollmentPopup = useCallback(() => {
    setConfirmEnrollmentPopupOpen(true);
  }, []);

  const closeConfirmEnrollmentPopup = useCallback(() => {
    setConfirmEnrollmentPopupOpen(false);
  }, []);

  const onBackarrowContainerClick = useCallback(() => {
    navigate("/Tutorials");
  }, [navigate]);

  const onVectorIconClick = useCallback(() => {
    navigate("/Tutorials");
  }, [navigate]);
  
  const uniqueLanguages = new Set();
  if (tutorial && tutorial.level && tutorial.level.length > 0) {
    tutorial.level.forEach((level) => {
      if (level.progLang) {
        uniqueLanguages.add(level.progLang);
      }
    });
  }

  

  return (
    <>
      <div className={styles.tutorialcardmain}>
        <div className={styles.tutorialcardmainChild} />
        <div className={styles.classesAndObjects}>{tutorial.tutName}</div>
        <div className={styles.tutorialPage}>All Tutorials</div>

       {Array.from(uniqueLanguages).map((language, index) => (
          <AvailableLanguages key={language} language={language} propLeft={`${30+ (index % 4) * 75}px`} />
        ))}
        <img className={styles.cloudIcon} alt="" src="/cloud@2x.png" />
        <div className={styles.button} >
          <button
            className={styles.buttonChild}
            onClick={openEnrollPopUp}>
            Enroll
          </button>
          
        </div>
        <div className={styles.backarrow} onClick={onBackarrowContainerClick}>
          <img
            className={styles.vectorIcon}
            alt=""
            src="/vector2@2x.png"
            onClick={onVectorIconClick}
          />
          <img className={styles.vectorIcon1} alt="" src="/vector3@2x.png" />
        </div>
      </div>
      {isEnrollPopUpOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeEnrollPopUp}
        >
          <EnrollPopUp onClose={closeEnrollPopUp} tutorialId={tutorial._id} />
        </PortalPopup>
      )}
    </>
  );
};

export default TutorialForm;
