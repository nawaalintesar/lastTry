import styles from "./LessonContinuation.module.css";

import { useState, useCallback, useEffect, dispatch } from "react";
import { useNavigate } from "react-router-dom";

const LessonContinuation = ({ tutorial, tutorialId, language, onClose }) => {

  const navigate = useNavigate();


  const onFrameButtonClick = useCallback((levelClicked) => {
    navigate("/CodeEditor", { state: { tutorialId, levelClicked , language } });
  }, [navigate, tutorialId,language]);
  

  console.log("ID IN POPUP", tutorialId);
  console.log("LANGUAGE IN POPUP", language);

  return (
    <div className={styles.lessonContinuation}>
      <div className={styles.lessonContinuationParent}>
        <div className={styles.lessonContinuation1}>Lesson Continuation</div>
        <div className={styles.welcomeBackChooseContainer}>
          <p className={styles.welcomeBack}>Welcome Back!</p>
          <p className={styles.welcomeBack}>
            Choose which lesson plan you would like to continue with today.
          </p>
        </div>
        <div className={styles.frameForLevels}>
          <button className={styles.rectangleParent} onClick={() => onFrameButtonClick('1')}>
            <button className={styles.frameChild} />
            <div className={styles.level1}>Level 1</div>
          </button>
          <div className={styles.rectangleGroup} onClick={() => onFrameButtonClick('2')}>
            <button className={styles.frameChild} />
            <div className={styles.level2}>Level 2</div>
          </div>
          <div className={styles.rectangleContainer} onClick={() => onFrameButtonClick('3')}>
            <button className={styles.frameChild} />
            <div className={styles.level3}>Level 3</div>
          </div>
        </div>
        <img
          className={styles.pagecrossIcon}
          alt=""
          src="/pagecross2.svg"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default LessonContinuation;
