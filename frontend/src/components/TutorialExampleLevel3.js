import { useMemo } from "react";
import styles from "./TutorialExampleLevel3.module.css";
import { message } from "antd";
import { useState, useCallback, useEffect, dispatch } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
const TutorialExampleLevel3 = ({
  tutorial,
  tutorialId,
  lessonTitle,
  lessonDescription,
  property1DefaultWidth,
  property1DefaultHeight,
  property1DefaultPosition,
  property1DefaultTop,
  property1DefaultRight,
  property1DefaultBottom,
  property1DefaultLeft,
  onProperty1DefaultClick,
  levelClicked,

}) => {
  const user = useAuthContext();

  const property1DefaultStyle = useMemo(() => {
    return {
      width: property1DefaultWidth,
      height: property1DefaultHeight,
      position: property1DefaultPosition,
      top: property1DefaultTop,
      right: property1DefaultRight,
      bottom: property1DefaultBottom,
      left: property1DefaultLeft,
    };
  }, [
    property1DefaultWidth,
    property1DefaultHeight,
    property1DefaultPosition,
    property1DefaultTop,
    property1DefaultRight,
    property1DefaultBottom,
    property1DefaultLeft,

  ]);
  const navigate = useNavigate();

  const fetchEnrolledTutorialsPopUp = async (dispatch, user) => {
    try {
      const response = await fetch(`/api/tutorials/enrolled`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user.user.token}`,
          'Content-Type': 'application/json'
        },
      });

      const json = await response.json();
      console.log("Json is", json)

      return json;

    } catch (error) {
      console.error('Error fetching enrolled tutorials:', error);

    }
  };


  let language;
  const checkEnrolledStatus = async (lang) => {
    try {
      const response = await fetchEnrolledTutorialsPopUp(dispatch, user);
      const lastEnrolled = response?.enrolledTutorials?.slice().reverse().find(tutorial => tutorial.tutId._id === tutorialId);
      const language = lastEnrolled?.tutId?.level[levelClicked].progLang;
      const tutorialLevelClicked = lastEnrolled?.tutId?.level[levelClicked].levelNumber;
      console.log("chosen", lastEnrolled)
      if (lastEnrolled) {
        console.log("CHOSEN ONE", levelClicked, language);
        return { tutorialId, levelClicked, language }; // Return data instead of navigating
      } else {
        message.info("Enroll in a tutorial and choose a language to get started!");
        return null; // Return null for cases where the user isn't enrolled
      }
    } catch (error) {
      console.error("Error fetching enrolled tutorials:", error);
      throw error; // Rethrow the error to be caught by the caller
    }
  };

  const onFrameButtonClick = useCallback(async () => {
    try {
      const navigationData = await checkEnrolledStatus();
      if (navigationData) {
        console.log("CHOSENNN", navigationData);
        navigate("/CodeEditor", { state: navigationData });
      }
    } catch (error) {
      console.error("Error checking enrolled status:", error);
      // Handle the error here if needed
    }
  }, [navigate, tutorialId, levelClicked, language]);

  return (
    <button
      className={styles.property1default}
      id="Ex1Tut"
      onClick={onFrameButtonClick}
      style={property1DefaultStyle}
    >
      <div className={styles.creatingAnimalObjects}>{lessonTitle}</div>
      <div className={styles.learnHowToContainer}>
        <p className={styles.learnHowTo}>{lessonDescription}</p>
      </div>
      <img className={styles.vectorIcon} alt="" src="/vector6@2x.png" />
    </button>
  );
};

export default TutorialExampleLevel3;
