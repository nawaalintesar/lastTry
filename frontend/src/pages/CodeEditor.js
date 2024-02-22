import React, { useState, useEffect, useCallback } from "react";
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow';
import Property1Default from "../components/Property1Default";
import Property1Closed from "../components/Property1Closed";
import { useLocation } from "react-router-dom";
import { useProjectsContext } from "../hooks/useProjectsContext";
import { useTutorialsContext } from "../hooks/useTutorialsContext";
import { useNavigate } from "react-router-dom";
import LogOutPopOutL from "../components/LogOutPopOutL";
import PortalPopup from "../components/PortalPopup";
import Footer from "../components/Footer";
import Property1Default2 from "../components/Property1Default2";
import FileNavigationContainer from "../components/FileNavigationContainer";
import OutputContainer from "../components/OutputContainer";
import AnimationContainer from "../components/AnimationContainer";
import styles from "./CodeEditor.module.css";

import { useAuthContext } from "../hooks/useAuthContext";

const CodeEditor = () => {
  const user = useAuthContext();
  const { project, dispatch: projectDispatch } = useProjectsContext();
  const { tutorial, dispatch: tutorialDispatch } = useTutorialsContext();

  const { state , pathname: currentPath} = useLocation();

  const projectId = state ? state.ProjectId : "65d57921b81b7f5c349e0705";
  const tutorialId = state ? state.tutorialId : null;
  const levelClicked = state ? state.levelClicked : null;
  const language = state ? state.language : null;

  console.log("Project ID:", projectId);
  console.log("Tutorial ID:", tutorialId);
  console.log("Level Clicked:", levelClicked);
  console.log("Language Clicked:", language);
  const [isLogOutPopOutLPopupOpen, setLogOutPopOutLPopupOpen] = useState(false);
  const [isLogOutPopOutLPopup1Open, setLogOutPopOutLPopup1Open] =
    useState(false);
  const navigate = useNavigate();

  const onFrameButtonClick = useCallback(() => {
    handleUnload();
    navigate("/CodeEditor");
    // Please sync "Code Editor- after login" to the project
  }, [navigate]);

  const onVoopClick = useCallback(() => {
    if (projectId === "65d57921b81b7f5c349e0705") {
      handleUnload();
      navigate("/")
    } else {
      navigate("/Dashboard");
    }
  }, [navigate]);

  const onFrameContainer3Click = useCallback(() => {
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

  const onFrameButtonClickSignIn = useCallback(() => {
    handleUnload();
    navigate("/signIn");
    // Please sync "Code Editor- after login" to the project
  }, [navigate]);



  const handleUnload = async () => {
    try {
      if (projectId === "65d57921b81b7f5c349e0705") {

      
      const response = await fetch(`api/projects/65d57921b81b7f5c349e0705/clearCodeStates`);
      const json = await response.json();
    }
    } catch (error) {
    console.error("error", error)
  }
};

  useEffect(() => {


    const fetchProjects = async () => {
      try {
        let headers = {};
        if (projectId !== "65d57921b81b7f5c349e0705" && user.user.userEmail) {
          headers = { 'Authorization': `Bearer ${user.user.token}` };
        }
        const response = await fetch(`/api/projects/${projectId}`, {
          headers: headers
        });
        const json = await response.json();

        if (response.ok) {
          projectDispatch({ type: 'GET_PROJECT', payload: json });


        }
      } catch (error) {
        console.error('Error fetching project:', error);
      }
    };

    const fetchTutorials = async () => {
      console.log("IN FUCN .", tutorialId)
      if (tutorialId) {
        try {
          const response = await fetch(`/api/tutorials/${tutorialId}`, {
            headers: { 'Authorization': `Bearer ${user.user.token}` }
          });
          const json = await response.json();

          if (response.ok) {
            tutorialDispatch({ type: 'GET_TUTORIAL', payload: json });
          }
        } catch (error) {
          console.error('Error fetching tutorial:', error);
        }
      }

    };

    // Fetch projects only if projectId is present
    console.log(projectId)
    console.log(tutorialId)
    if (projectId && !user?.user?.userEmail) {
      console.log("No user or userEmail");
      fetchProjects();
    } else if (projectId && user.user.userEmail) {
      console.log("Hello user from inside code editor for projects");
      console.log(user.user);
      fetchProjects();
    } else if (tutorialId && user.user.userEmail) {
      console.log("Hello user from inside code editor for tuts");
      console.log(user.user);
      fetchTutorials();
    }


  window.addEventListener('beforeunload', handleUnload);

  return () => {
    window.removeEventListener('beforeunload', handleUnload);
  };
}, [user, projectDispatch, tutorialDispatch, projectId, tutorialId]);


const [fileSelectedOnNav, setFileSelectedOnNav] = useState(/* initial value */);
const handleUpdatedFile = useCallback((index) => {
  setFileSelectedOnNav(index);
  console.log("Updatedfile in code eidtor", index)
}, []);

const [selectedFileName, setSelectedFileName] = useState(null);

const handleFileSelected = useCallback((index) => {
  // Handle the selected file name, you can use it as needed
  console.log("Selected File IN CODE EDITOR:", index);
  setSelectedFileName(index);
}, []);

const [undoButtonClicked, setUndoButtonClicked] = useState(false);

const handleUndoButtonClick = useCallback((value) => {
  console.log("new life", value)
  setUndoButtonClicked(value);
}, []);


return (
  <div>
    {user.user ? (
      <div className={styles.CodeEditor}>
        <div className={styles.frameGenericTutorial}>
          {project && <FileNavigationContainer key={projectId} project={project} fileSelectedOnNav={handleFileSelected} updatedFileSelected={fileSelectedOnNav} />}
          {tutorial && <FileNavigationContainer key={tutorialId} tutorial={tutorial} levelClicked={levelClicked} language={language} fileSelectedOnNav={handleFileSelected} updatedFileSelected={fileSelectedOnNav} />}

          {project && <AnimationContainer key={projectId} project={project} undoButton={handleUndoButtonClick} />}
          {tutorial && <AnimationContainer tutorial={tutorial} levelClicked={levelClicked} language={language} />}

          <div className={styles.mainWrapper}>
            {project && <OutputContainer key={projectId} project={project} undoButton={undoButtonClicked}
              fileSelectedOnNav={selectedFileName} isUpdated={handleUpdatedFile} />}
            {tutorial && <OutputContainer key={tutorialId} tutorial={tutorial} levelClicked={levelClicked} language={language}
              fileSelectedOnNav={selectedFileName} isUpdated={handleUpdatedFile} />}
          </div>
        </div>
        <Property1Closed
          onFrameContainerClick={onFrameContainer3Click}
          onFrameIconClick={onFrameIconClick}
          onUsericonContainerClick={onUsericonClick}
          onDashoboardSMContainerClick={onDashoboardSMContainerClick}
        />

        <Property1Default
          onFrameButtonClick={onFrameButtonClick}
          onVoopClick={onVoopClick}
        />
        <Footer />
      </div>

    ) : (
      <div className={styles.CodeEditor}>

        <div className={styles.frameGenericTutorial}>
          <FileNavigationContainer customClassName={styles.customFileNavigation} project={project} fileSelectedOnNav={handleFileSelected} updatedFileSelected={fileSelectedOnNav} />
          <img
            className={styles.frameGenericTutorialChild}
            alt=""
            src="/line-7@2x.png"
          />
          <div className={styles.mainWrapper}>
            <OutputContainer customOutputContainer={styles.customOutputContainer} project={project} undoButton={undoButtonClicked}
              fileSelectedOnNav={selectedFileName} isUpdated={handleUpdatedFile} />
          </div>
          <AnimationContainer AnimationContainer={styles.AnimationContainer} project={project} undoButton={handleUndoButtonClick} />
        </div>
        <Property1Default2
          buttonText="codeEditorButtonHeader"
          actionButtonText="Sign In"
          property1DefaultAlignContent="stretch"
          property1DefaultJustifyContent="unset"
          property1DefaultPosition="absolute"
          property1DefaultTop="0px"
          property1DefaultLeft="0px"
          buttonPadding="var(--padding-smi) 0px"
          buttonOverflow="unset"
          textDisplay="inline-block"
          textWidth="unset"
          textFlexShrink="unset"
          textCursor="pointer"
          onFrameButtonClick={onFrameButtonClick}
          onFrameButtonClickSignIn={onFrameButtonClickSignIn}
          onVoopClick={onVoopClick}
        />
        <Footer />

      </div>
    )}


  </div>
);

};
export default CodeEditor;