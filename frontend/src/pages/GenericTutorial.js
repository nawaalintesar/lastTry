
import { useLocation } from "react-router-dom";
import { useState, useCallback, useEffect, dispatch } from "react";
import { useNavigate } from "react-router-dom";
import { useTutorialsContext } from "../hooks/useTutorialsContext";
import TutorialForm from "../components/TutorialForm";
import TutorialExamplesContainer1 from "../components/TutorialExamplesContainer1";
import LogOutPopOutL from "../components/LogOutPopOutL";
import PortalPopup from "../components/PortalPopup";
import Footer from "../components/Footer";
import Property1Default from "../components/Property1Default";
import Property1Closed from "../components/Property1Closed";
import styles from "./GenericTutorial.module.css";
import { useAuthContext } from "../hooks/useAuthContext";

const GenericTutorial = () => {
  const user =useAuthContext();
  const [isLogOutPopOutLPopupOpen, setLogOutPopOutLPopupOpen] = useState(false);
  const [isLogOutPopOutLPopup1Open, setLogOutPopOutLPopup1Open] = useState(false);
  const navigate = useNavigate();

  const onFrameButtonClick = useCallback(() => {
    // Please sync "Code Editor- after login" to the project
    navigate("/CodeEditor");
  }, [navigate]);

  const onFrameContainer2Click = useCallback(() => {
    // Please sync "Mytutorials-L" to the project
    navigate("/Tutorials");
  }, [navigate]);

  const onFrameIconClick = useCallback(() => {
    // Please sync "MyProjects-L" to the project
    navigate("/Projects");
  }, [navigate]);

  const onUsericonClick = useCallback(() => {
    navigate("/Profile");
  }, [navigate]);

  const onDashoboardSMContainerClick = useCallback(() => {
    navigate("/Dashboard");
  }, [navigate]);

  const onVoopClick = useCallback(() => {
    navigate("/Dashboard");
  }, [navigate]);
  
  const { tutorial, dispatch } = useTutorialsContext();
  const { state } = useLocation();
  const tutorialId = state ? state.TutorialId : null;

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const response = await fetch(`/api/tutorials/${tutorialId}`, {
          headers: { 'Authorization': `Bearer ${user.user.token}` }
          
        });
        
        const json = await response.json();

        if (response.ok) {
          dispatch({ type: 'GET_TUTORIAL', payload: json });
        }
      } catch (error) {
        console.error('Error fetching tutorial:', error);
      }
    };
    if (user.user.userEmail) {
      //console.log("HEllo user from inside GTT")
      console.log(user.user)
      fetchTutorials();
    }
    
  }, [user,dispatch, tutorialId]);

  return (
    <div className={styles.GenericTutorial}>
      {tutorial && (
        <div className={styles.textParent}>
          <div className={styles.text}>
            <div className={styles.aboutThisTutorial}>About this tutorial</div>
            {tutorial && (
              <>
                <div className={styles.classesDefineThe1}>
                {tutorial.tutDescription.includes('.') ? tutorial.tutDescription.substring(tutorial.tutDescription.indexOf('.') + 1).trim() : tutorial.tutDescription}
                </div>
              </>
            )}
          </div>

          {tutorial && (
            <TutorialForm
              key={tutorial._id}
              tutorial={tutorial}
              
            />
          )}

          <TutorialExamplesContainer1
            key={tutorial._id}
            tutorial={tutorial}
          />
        </div>
      )}

      <Property1Default
        onFrameButtonClick={onFrameButtonClick}
        onVoopClick={onVoopClick}
      />

      <Property1Closed
        onFrameContainerClick={onFrameContainer2Click}
        onFrameIconClick={onFrameIconClick}
        onUsericonContainerClick={onUsericonClick}
        onDashoboardSMContainerClick={onDashoboardSMContainerClick}
      />

      <Footer />
    </div>
  );
};

export default GenericTutorial;
