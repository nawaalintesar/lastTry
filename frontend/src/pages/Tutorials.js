import { useEffect, dispatch, useState, useCallback } from "react";
import { TextField, InputAdornment, Icon, IconButton } from "@mui/material";
import LogOutPopOutL from "../components/LogOutPopOutL";
import PortalPopup from "../components/PortalPopup";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Property1Default from "../components/Property1Default";
import FilteredFormCard from "../components/FilteredFormCard";
import AbstractContainer from "../components/AbstractContainer";
import Property1Closed from "../components/Property1Closed";
import styles from "./Tutorials.module.css";
import { useTutorialsContext } from "../hooks/useTutorialsContext.js";
import { useAuthContext } from "../hooks/useAuthContext";
import {  message } from "antd";

const Tutorials = () => {

  const user = useAuthContext();
  const { tutorials, dispatch } = useTutorialsContext();
  const [tut, setTutorials] = useState(null);
  const [isLogOutPopOutLPopupOpen, setLogOutPopOutLPopupOpen] = useState(false);
  const [isLogOutPopOutLPopup1Open, setLogOutPopOutLPopup1Open] = useState(false);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const tutorialsPerPage = 4;
  const [swiper, setSwiper] = useState(null);

  const handlePrevClick = () => {
    setCurrentSlide((prevSlide) => Math.max(0, prevSlide - tutorialsPerPage));
  };

  const handleNextClick = () => {
    const nextSlide = currentSlide + tutorialsPerPage;
    const maxSlide = Math.max(0, (tutorials && tutorials.length || 0) - tutorialsPerPage);
    setCurrentSlide(Math.min(nextSlide, maxSlide));
  };

  // const handleNextClick = () => {
  //   const nextSlide = currentSlide + tutorialsPerPage;
  //   setCurrentSlide(Math.min(nextSlide, tutorials.length - tutorialsPerPage));
  // };


  useEffect(() => {
    const fetchTutorials = async () => {
      const response = await fetch('/api/tutorials', {
        headers: { 'Authorization': `Bearer ${user.user.token}` }

      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_TUTORIALS', payload: json })
      }
    }
    if (user.user.userEmail) {
      console.log("HEllo user from inside tutorials")
      console.log(user.user)
      fetchTutorials();
    }


  }, [user, dispatch]);

  const handleDotClick = (index) => {
    setCurrentSlide(index); // Assuming setCurrentSlide is a function to update the current slide index
  };


  const onTutContainerClick = useCallback((TutorialId) => {
    navigate("/GenericTutorial", { state: { TutorialId } });
  }, [navigate]);

  const onFrameContainer2Click = useCallback(() => {
    navigate("/Tutorials");
  }, [navigate]);

  const onFrameButtonClick = useCallback(() => {
    // Please sync "Code Editor- after login" to the project
    navigate("/CodeEditor");
  }, [navigate]);

  const onFrameIconClick = useCallback(() => {
    navigate("/Projects");
  }, [navigate]);

  const onUsericonClick = useCallback(() => {
    navigate("/Profile");
  }, [navigate]);

  const onDashoboardSMContainerClick = useCallback(() => {
    navigate("/Dashboard");
  }, [navigate]);


  const onMethodoverloadingOverriddingTContainerClick = useCallback(() => {
    navigate("/GenericTutorial");
  }, [navigate]);

  const onComprehensiveOOPTutContainerClick = useCallback(() => {
    navigate("/GenericTutorial");
  }, [navigate]);

  const onVoopClick = useCallback(() => {
    navigate("/Dashboard");
  }, [navigate]);

  var items = 1;
  var margin = 0;
  const onSearch = async (value) => {
    const fetchSearchResults = async () => {
      console.log("response heree", value);
      try {
        const response = await fetch('/api/tutorials/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.user.token}` },
          body: JSON.stringify({ text: value }),
        });

        if (response.ok) {
          const searchResults = await response.json();
          if (searchResults?.searchResults) {
            dispatch({ type: 'SET_TUTORIALS', payload: searchResults?.searchResults });
            console.log("respnose", searchResults?.searchResults)
          }
          else{
            console.log(searchResults.message)
           message.info(searchResults.message);
           dispatch({ type: 'SET_TUTORIALS', payload: searchResults });
          }
        } else {
          console.error('Error fetching search results:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };
  
    if (user.user.userEmail) {
      try {
        // Await the fetchSearchResults function
        await fetchSearchResults();
      } catch (error) {
        console.error('Error in onSearch:', error);
      }
    }
  };
  
  

  return (
    <div className={styles.Tutorials}>


      <div className={styles.items}>

        <b className={styles.continueTheJourney}>Continue The Journey</b>

        <FilteredFormCard />

        <b className={styles.allTutorials}>All Tutorials</b>
        <div className={styles.alltutorials}>


          <div>
            <TextField
              className={styles.searchBar}
              color="secondary"
              name="Search"
              label="Search"
              placeholder="Search"
              sx={{ width: 1089 }}
              variant="filled"
              type="search"
              onChange={(event) => onSearch(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.slidercontainer}>
          <div className={styles.slider}>
            <div className={styles.slider}>
              {tutorials &&
                tutorials.length > 0 &&
                tutorials.slice(currentSlide, currentSlide + tutorialsPerPage).map((tutorial, index) => (
                  <AbstractContainer
                    key={index}
                    tutorial={tutorial}
                    conceptDescription={tutorial.tutName}
                    onTutContainerClick={() => onTutContainerClick(tutorial._id)}
                    propLeft={`${index * 280}px`}
                    propLineHeight={`${index * 250}px`}
                  />
                ))}
            </div>




          </div>
          <button className={styles.prev} onClick={handlePrevClick} disabled={currentSlide === 0}>
            ❮
          </button>
          <button
            className={styles.next}
            onClick={handleNextClick}
            disabled={(tutorials && currentSlide + tutorialsPerPage >= tutorials.length) || !tutorials}
          >
            ❯
          </button>
          <div className={styles.dotsContainer}>
            {tutorials &&
              Array.from({ length: Math.ceil((tutorials.length || 0) / tutorialsPerPage) }).map((_, index) => {
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




        {/*   //style={{ transform: `translateX(-${currentSlide * 250}px)` }} 
        <div className={styles.alltutorialsrow2}>
          {tutorials &&
            tutorials.slice(4, 8).map((tutorial, index) => (
              <AbstractContainer
                key={index}
                tutorial={tutorial}
                conceptDescription={tutorial.tutName}
                onTutContainerClick={() => onTutContainerClick(tutorial._id)}
                propLeft={`${index * 250}px`}
                propLineHeight={`${index * 250}px`}
              />
            ))}
        </div> */}

      </div>


      <Footer />

      <Property1Default
        onFrameButtonClick={onFrameButtonClick}
        onVoopClick={onVoopClick}
      />
      {/* <Footer /> */}
      <Property1Closed
        onFrameContainerClick={onFrameContainer2Click}
        onFrameIconClick={onFrameIconClick}
        onUsericonContainerClick={onUsericonClick}
        onDashoboardSMContainerClick={onDashoboardSMContainerClick}
      />
    </div>

  );
};

export default Tutorials;
