// ContinueLearningSection.js
import {React, useEffect , dispatch, useState}from "react";
import { useTutorialsContext } from "../hooks/useTutorialsContext.js";
import InheritencetutCard from "./InheritencetutCard";
import styles from "./ContinueLearningSection.module.css";
import { useAuthContext } from "../hooks/useAuthContext";

const ContinueLearningSection = () => {
  const user = useAuthContext();
  
  const [progressMap, setProgressMap] = useState({});
  const { enrolledTutorials, dispatch } = useTutorialsContext();
 
  useEffect(() => {
  const fetchEnrolledTutorials = async () => {

      try {
        const response = await fetch('/api/tutorials/enrolled', {
          headers: { 'Authorization': `Bearer ${user.user.token}` }
        });
        const json = await response.json();
        console.log("here", json.enrolledTutorials);

        if (response.ok) {
          dispatch({ type: 'GET_ENROLLED_TUTORIALS', payload: json.enrolledTutorials });
        }
      } catch (error) {
        console.error('Error fetching enrolled tutorials:', error.message);
      }
    
    };

    if (user.user.userEmail) {
      console.log("HEllo user from inside DASHBOARD 222")
      console.log(user.user)
      fetchEnrolledTutorials();
    }
  }, [user, dispatch]);
  
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressObj = {};
        for (const enrolledTutorial of enrolledTutorials) {
          const { tutId, progLang } = enrolledTutorial;
          const response = await fetchProgressForTutorial(tutId._id, progLang);

          if (response.ok) {
            const progress = await response.json();
            progressObj[tutId._id] = progress;
          } else {
            progressObj[tutId._id] = 0; // Default progress if not found
          }
        }
        console.log("fetching progress", progressObj)
        setProgressMap(progressObj);
      } catch (error) {
        console.error('Error fetching progress:', error.message);
      }
    };

    if (user.user.userEmail && enrolledTutorials?.length > 0) {
      fetchProgress();
    }
  }, [user, enrolledTutorials, dispatch]);
  const fetchProgressForTutorial = async (tutorialId, progLang) => {
    const response = await fetch('/api/tutorials/calculateProgress', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.user.token}`
      },
      body: JSON.stringify({
        userId: user.user.userID,
        tutorialId: tutorialId,
        progLang: progLang
      })
    });
    return response;
  };
    return (
      <div className={styles.continueLearning}>
        {enrolledTutorials &&
          enrolledTutorials.map((enrolledTutorial, index) => {
            const uniqueLanguages = new Set();
            const tutorial = enrolledTutorial.tutId;

            // Check if the tutorial exists and has the progLang property
            if (tutorial && enrolledTutorial.progLang) {
              uniqueLanguages.add(enrolledTutorial.progLang);
              console.log(
                "Rendering ContinueLearningSection:",
                enrolledTutorial.progLang,
                Array.from(uniqueLanguages)
              );
            } else {
              console.log(
                "Rendering ContinueLearningSection: No valid tutorial or progLang property"
              );
            }

            // Calculate row and column indices
            const rowIndex = Math.floor(index / 4);
            const colIndex = index % 4;

            return Array.from(uniqueLanguages).slice(0, 4).map((language, languageIndex) => (
              <InheritencetutCard
                key={`${enrolledTutorial.tutId._id}-${languageIndex}`}
                tutorial={enrolledTutorial.tutId}
                language={language}
                inheritencetutCardPosition="absolute"
                inheritencetutCardTop={`${50 + rowIndex * 300}px`}
                inheritencetutCardLeft={`${10 + colIndex * 255 + 240 * languageIndex}px`}
                encapsulationTutCardCursor="pointer"
                progress={progressMap[enrolledTutorial.tutId._id]?.progress || 0}
                progressWidth={progressMap[enrolledTutorial.tutId._id]?.progress || 0}
              />
            ));
          })}
      </div>
    );
  };

  export default ContinueLearningSection;
