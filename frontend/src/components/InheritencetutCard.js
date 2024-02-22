import { useState, useMemo, useCallback } from "react";
import LessonContinuation from "./LessonContinuation";
import PortalPopup from "./PortalPopup";
import styles from "./InheritencetutCard.module.css";
import { tutorialColors, hoverColors } from "./tutorialColors"; // Import the tutorialColors file


const InheritencetutCard = ({
  tutorial,
  language,
  inheritencetutCardPosition,
  inheritencetutCardTop,
  inheritencetutCardLeft,
  progress,
  progressWidth
}) => {
 // console.log("Rendering InheritencetutCard:", tutorial._id, language);

  const [isLessonContinuationPopupOpen, setLessonContinuationPopupOpen] =
    useState(false);
  const inheritencetutCardStyle = useMemo(() => {
    return {
      position: inheritencetutCardPosition,
      top: inheritencetutCardTop,
      left: inheritencetutCardLeft,
    };
  }, [
    inheritencetutCardPosition,
    inheritencetutCardTop,
    inheritencetutCardLeft,
  ]);

  const openLessonContinuationPopup = useCallback(() => {
    setLessonContinuationPopupOpen(true);
  }, []);

  const closeLessonContinuationPopup = useCallback(() => {
    setLessonContinuationPopupOpen(false);
  }, []);

  console.log("ID IN tut",tutorial._id);
  console.log(tutorial);

  const rectangleDivStyle = useMemo(() => {
    const backgroundColor = tutorialColors[tutorial._id] || "linear-gradient(92.09deg, #aeb2c0 36.98%, #827e9b)";

    return {
      background: backgroundColor,

    };
  }, [ tutorial._id]);

  const rectangleDiv = useMemo(() => {
    return {
      width: `${progressWidth}%`, // Set width based on progressWidth

    };
  }, [progressWidth]);
  
  const hoverStyle = useMemo(() => {
    const hoverColor = hoverColors[tutorial._id] || "rgba(68, 47, 204, 0.7)";
    console.log("COLOUR",tutorial._id,tutorial.tutName,hoverColor);
    return {
      "--hover-color": hoverColor, // Set the hover color as a CSS variable
    };
  }, [tutorial._id]);

  return (
    <>
       <div
        className={styles.inheritencetutcard}
        onClick={ () => openLessonContinuationPopup(tutorial._id,language) } 
        
        style={{ ...inheritencetutCardStyle, ...hoverStyle }}
      >
        <div className={styles.inheritencetutcardChild} />
        <div 
        className={styles.inheritencetutcardItem} style={rectangleDivStyle} />
        <div className={styles.enablesANew}>
         {tutorial.tutDescription.split('.')[0]}
        </div>

        <div className={styles.inheritance}>{tutorial.tutName  + language}</div>
        <div className={styles.inheritencetutcardInner} />
        <div className={styles.rectangleDiv} style={rectangleDiv}/>
        <div className={styles.div}>{progress+"%"}</div>
      </div>  

      {isLessonContinuationPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeLessonContinuationPopup}
        >
          <LessonContinuation tutorial = {tutorial} tutorialId={tutorial._id} language={language} onClose={closeLessonContinuationPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default InheritencetutCard;