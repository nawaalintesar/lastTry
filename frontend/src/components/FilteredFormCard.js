//import { useState, useCallback } from "react";
import LessonContinuation from "./LessonContinuation";
import PortalPopup from "./PortalPopup";
import InheritencetutCard from "./InheritencetutCard";
import styles from "./FilteredFormCard.module.css";
import { useEffect, dispatch, useState, useCallback } from "react";
import { useTutorialsContext } from "../hooks/useTutorialsContext.js";
import { useAuthContext } from "../hooks/useAuthContext";

const FilteredFormCard = () => {
  const user = useAuthContext();
  const [progressMap, setProgressMap] = useState({});
  const { enrolledTutorials, dispatch } = useTutorialsContext();
  const [isLessonContinuationPopupOpen, setLessonContinuationPopupOpen] =
    useState(false);
  const [isLessonContinuationPopup1Open, setLessonContinuationPopup1Open] =
    useState(false);
  const [isLessonContinuationPopup2Open, setLessonContinuationPopup2Open] =
    useState(false);
  const [isLessonContinuationPopup3Open, setLessonContinuationPopup3Open] =
    useState(false);

  const openLessonContinuationPopup = useCallback(() => {
    setLessonContinuationPopupOpen(true);
  }, []);

  const closeLessonContinuationPopup = useCallback(() => {
    setLessonContinuationPopupOpen(false);
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const tutorialsPerPage = 4;

  //  const handleNextClick = () => {
  //    setCurrentSlide((prevSlide) =>
  //      Math.min(prevSlide + tutorialsPerPage, enrolledTutorials.length - tutorialsPerPage)
  //    );
  //    console.log('Next Click: Current Slide:', currentSlide);
  //  };



  const handleNextClick = () => {
    setCurrentSlide((prevSlide) =>
      Math.min(prevSlide + tutorialsPerPage, enrolledTutorials.length - 1)
    );
    console.log('Next Click: Current Slide:', currentSlide);
  };


  const handlePrevClick = () => {
    setCurrentSlide((prevSlide) => {
      const nextSlide = Math.max(0, prevSlide - tutorialsPerPage);
      console.log('Prev Click: Current Slide:', prevSlide, 'Next Slide:', nextSlide);
      return nextSlide;
    });
  };


  const handleDotClick = (index) => {
    setCurrentSlide(index); // Assuming setCurrentSlide is a function to update the current slide index
  };



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
  useEffect(() => {
    const fetchEnrolledTutorials = async () => {
      try {
        const response = await fetch('/api/tutorials/enrolled', {
          headers: { 'Authorization': `Bearer ${user.user.token}` }
        });
        const json = await response.json();
        console.log(json.enrolledTutorials);
  
        if (response.ok) {
          dispatch({ type: 'GET_ENROLLED_TUTORIALS', payload: json.enrolledTutorials });
          
          // // Calculate progress for each enrolled tutorial
          // json.enrolledTutorials.forEach(async enrolledTutorial => {
          //   try {
          //     const progress = await calculateProgress(enrolledTutorial.tutId._id, enrolledTutorial.progLang);
          //     console.log("calculated progress", enrolledTutorial.tutId._id, enrolledTutorial.progLang, progress, user.user.id);
          //     // Handle the progress data here, for example, dispatching it to state
          //   } catch (error) {
          //     console.error('Error calculating progress:', error.message);
          //   }
          // });
        }
      } catch (error) {
        console.error('Error fetching enrolled tutorials:', error.message);
      }
    };
  
    if (user.user.userEmail) {
      fetchEnrolledTutorials();
    }
  }, [user, dispatch]);
  


  return (
    <>
      <div className={styles.continuejourneycards}>
        <div className={styles.slider}>
          {enrolledTutorials &&
            enrolledTutorials.slice(currentSlide, currentSlide + tutorialsPerPage).map((enrolledTutorial, index) => {
              const uniqueLanguages = new Set();
              const tutorial = enrolledTutorial.tutId;

              // Check if the tutorial exists and has the progLang property
              if (tutorial && enrolledTutorial.progLang) {
                uniqueLanguages.add(enrolledTutorial.progLang);
                console.log("Rendering FilteredFormCard:", enrolledTutorial.progLang, Array.from(uniqueLanguages));
              } else {
                console.log("Rendering FilteredFormCard: No valid tutorial or progLang property");
              }




              // Calculate row and column indices
              const rowIndex = Math.floor(index / 4);
              const colIndex = index % 4;

              return Array.from(uniqueLanguages).map((language, languageIndex) => (

                <InheritencetutCard
                  key={`${enrolledTutorial.tutId._id}-${languageIndex}`}
                  tutorial={enrolledTutorial.tutId}
                  language={language}
                  inheritencetutCardPosition="absolute"
                  inheritencetutCardTop={`${50 + rowIndex * 300}px`}
                  inheritencetutCardLeft={`${+ colIndex * 270 + 240 * languageIndex}px`}
                  encapsulationTutCardCursor="pointer"
                  progress={progressMap[enrolledTutorial.tutId._id]?.progress || 0}
                  progressWidth={progressMap[enrolledTutorial.tutId._id]?.progress || 0}
                />

              ));


            })}

        </div>
        <button className={styles.prev} onClick={handlePrevClick} disabled={currentSlide === 0}>
          ❮
        </button>
        <button
          className={styles.next}
          onClick={handleNextClick}
          disabled={!enrolledTutorials || currentSlide + tutorialsPerPage >= enrolledTutorials.length}
        >
          ❯
        </button>
        <div className={styles.dotsContainer}>


          {enrolledTutorials &&
            Array.from({ length: Math.ceil((enrolledTutorials.length || 0) / tutorialsPerPage) }).map((_, index) => {
              const isActive = index === Math.floor(currentSlide / tutorialsPerPage);
              return (
                <span
                  key={index}
                  className={`${styles.dot} ${isActive ? styles.active : ""}`}
                  onClick={() => handleDotClick(index * tutorialsPerPage)}
                ></span>
              );
            })
          }


        </div>

      </div>
      {isLessonContinuationPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeLessonContinuationPopup}
        >
          <LessonContinuation onClose={closeLessonContinuationPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default FilteredFormCard;
