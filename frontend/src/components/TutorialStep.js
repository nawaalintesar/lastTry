import { useMemo } from "react";
import styles from "./TutorialStep.module.css";
// ... (your imports and other code)

const TutorialStep = ({
  oopConceptTitles,
  conceptTitle,
  conceptDescription,
  conceptCode,
  conceptCodeImageUrls,
  carMake,
  conceptCodeDimensions,
  propTop,
  propLeft,
  propRight,
  propLeft1,
  propRight1,
  propLeft2,
  onNext, // Add onNext as a prop
  onPrev, // Add onPrev as a prop
  onNextBig,
  onPrevBig,
  isEditMinusClicked,
  isEditPlusClicked,
  onImplement,
  background
}) => {
  const step1Style = useMemo(() => {
    return {
      top: propTop,
      left: propLeft,
    };
  }, [propTop, propLeft]);

  const vectorIconStyle = useMemo(() => {
    return {
      right: propRight,
      left: propLeft1,
    };
  }, [propRight, propLeft1]);

  const vectorIcon1Style = useMemo(() => {
    return {
      right: propRight1,
      left: propLeft2,
    };
  }, [propRight1, propLeft2]);

  return (
<div className={styles.step1} style={{...step1Style, background: background}}>
        <div className={styles.content}>
        <div className={styles.identifiedOopConcept}>{oopConceptTitles}</div>
        <img
          className={styles.vectorIcon}
          alt=""
          src={conceptTitle}
          onClick={onPrev} // Call onPrev when the icon is clicked
        />
        <img
          className={styles.vectorIcon1}
          alt=""
          src={conceptDescription}
          onClick={onNext} // Call onNext when the icon is clicked
        />
        <img
          className={styles.vectorIcon2}
          alt=""
          src={conceptCode}
          style={vectorIconStyle}
          onClick={onPrevBig} // Call onPrev when the icon is clicked
        />
        <img
          className={styles.vectorIcon3}
          alt=""
          src={conceptCodeImageUrls}
          onClick={onNextBig} // Call onNext when the icon is clicked
          style={vectorIcon1Style}
        />
        {(isEditMinusClicked || isEditPlusClicked) && (
          <button className={styles.implement} onClick={onImplement}>
            {isEditMinusClicked ? "Implement" : "Implement"} 
          </button>
        )}

        <div className={styles.theFirstClass}>{carMake}</div>
        <div className={styles.div}>{conceptCodeDimensions}</div>
      </div>
    </div>
  );
};

export default TutorialStep;
