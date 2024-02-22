import React, { useState, useEffect } from 'react';
import IconfileMd from "./IconfileMd";
import AceEditor from 'react-ace';

import 'brace/mode/java';
import 'brace/mode/javascript';
import 'brace/theme/dracula';

import styles from "./OutputContainer.module.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useProjectsContext } from "../hooks/useProjectsContext.js";
import { useTutorialsContext } from '../context/TutorialsContext';
import { useCodeFilesContext } from '../hooks/useCodeFilesContext';
const OutputContainer = ({ customOutputContainer, project, tutorial, levelClicked, language, undoButton, fileSelectedOnNav, isUpdated, isUndone }) => {
  const user = useAuthContext();
  const { dispatch: dispatchTutorial, isObjectifyingTutorial } = useTutorialsContext();
  const { dispatch: dispatchProject, isObjectifyingProject } = useProjectsContext();

  const [code, setcode] = useState("");
  const codeFilez=useCodeFilesContext();
  const {dispatch: dispatchCodeFiles}=useCodeFilesContext();
  const [fileNames, setFileNames] = useState([]); // onclick from file navigation container for tutorials
  const [currentLevel, setCurrentLevel] = useState(null); // current tutorial level/ language array with everything

  const [codeFiles, setCodeFiles] = useState([]); // State to track files and their code for projects

  const [selectedFile, setSelectedFile] = useState(null); // the file whose code is currently open for both 
  const [openFiles, setOpenFiles] = useState([]); // all the tabs that are open for tutorial and projects

  console.log("UNDO CLICKED:", undoButton);
  console.log("pls", fileSelectedOnNav);
  console.log("qaaaaa", selectedFile)

  useEffect(() => {
    console.log('OutputContainer mounted');

    if (project) {
      if (undoButton) {
        // code data is being reset correctly but the updated code data needs to be sent to file navitagtion container so that the right code and files shows up when they click from there
        setCodeFiles(project?.project?.codeStates?.[1]?.codeData);
        //reset to false with undoButton=false;
      } else {
        const length = project?.project?.codeStates.length;
        const codeFilesFromProject = project?.project?.codeStates[length - 1]?.codeData;
        setCodeFiles(codeFilesFromProject);

      }
    }

    else if (tutorial) {
      const levelClickedNumber = parseInt(levelClicked, 10);
      const filteredLevels = tutorial.level.filter(level => level.progLang === language);
      const clickedLevel = filteredLevels[levelClickedNumber - 1];
      console.log("CLICKED LEVEL BEEEEEEEEEEEEEEEEEEEEEEEEE", clickedLevel.codeData)
      setCurrentLevel(clickedLevel);
      setCodeFiles(clickedLevel.codeData);
    }


  }, [project, undoButton, fileNames]);

  useEffect(() => {
    console.log('File Clicked changed');

    if (!openFiles.includes(fileSelectedOnNav) && fileSelectedOnNav !== null && fileSelectedOnNav !== undefined) {
      setOpenFiles((prevFileNames) => [...prevFileNames, fileSelectedOnNav]);
    }
    setSelectedFile(fileSelectedOnNav);
    console.log("openfiles", openFiles)
    setcode(codeFiles[fileSelectedOnNav]?.code.join("\n") || "Click an existing file or click the + icon add a new file.");
    dispatchCodeFiles({ type: 'UPDATE_CODE', payload:  codeFiles});

    // Update selectedFile to keep it in sync with fileSelectedOnNav

  }, [fileSelectedOnNav]);

  // useEffect(() => {
  //   if(codeFilez===undefined){
  //     setcode(codeFiles[fileSelectedOnNav]?.code.join("\n") || "Click an existing file or click the + icon add a new file.");

  //   }
  //    else if(fileSelectedOnNav!==null && codeFilez!==undefined){
  //   // console.log("U R SO COOL", codeFilez?.state?.codeFiles[fileSelectedOnNav]?.code);
  //   // console.log("U R SO confusing", codeFiles[fileSelectedOnNav]?.code.join("\n"));

  //   setcode(codeFiles[fileSelectedOnNav]?.code.join("\n") || "Click an existing file or click the + icon add a new file.");

  //    }
  // },[codeFilez])

  useEffect(()=>{
    if (tutorial) {
      dispatchTutorial({ type: 'SET_OBJECTIFY_STATE_TUTORIAL', payload: false }); // or false
    }
  },[tutorial, project])

  //upp file part
  const handleFileSelected = (index) => {

    if (index >= 0 && index < codeFiles.length) {
      // For projects
      setSelectedFile(index);
      if (index !== fileSelectedOnNav) {
        isUpdated(index);
      }

      setcode(codeFiles[index]?.code.join("\n") || "testinggg");
      dispatchCodeFiles({ type: 'UPDATE_CODE', payload:  codeFiles});
    }

  };
  
  const handleCloseFile = (index) => {

    if (index >= 0 && index < openFiles.length) {
      const updatedOpenFiles = openFiles.filter((fileName) => fileName !== openFiles[index]);
      setOpenFiles(updatedOpenFiles);
      const newCode = codeFiles[openFiles[index]]?.code?.join('\n');
      setcode(newCode);
      setSelectedFile(null); // Reset selected file for projects
      isUpdated(0);
    }

  };


  const handleObjectify = async () => {
    if (project) {

      const updatedCodeFiles = codeFiles.map((file) => ({
        fileName: file.fileName,
        code: file.code,
      }));

      // Create codeData directly with the "codeData" key
      const codeData = { codeData: updatedCodeFiles };
      console.log("code in objectify", codeData);
      // Update the project's codeStates
      dispatchProject({ type: 'UPDATE_PROJECT', payload: codeData });
      dispatchProject({ type: 'SET_OBJECTIFY_STATE_PROJECT', payload: true });

      try {
        let headers = { 'Content-Type': 'application/json' };

        console.log("CODE DATA BEFORE DEATH", codeData)
        const response = await fetch(`/api/projects/${project.project._id}`, {
          method: 'PATCH',
          headers: headers,
          body: JSON.stringify(codeData),
        });
        console.log("USERRRRRR", user.user.userEmail)

        if (response.ok) {
          headers = { 'Content-Type': 'application/json' };

          if (project.project._id !== "65d57921b81b7f5c349e0705" && user.user.userEmail) {
            headers = { 'Content-Type': 'application/json' };
          }
          const fetchResponse = await fetch(`/api/projects/${project.project._id}`, {
            headers: headers
          });
          const json = await fetchResponse.json();
          console.log("asdf json", json)
          if (fetchResponse.ok) {
            dispatchProject({ type: 'GET_PROJECT', payload: json });
            // here logic to fetch the last code state again/ 
            //what file are we on 
          }
          setcode(codeFiles[fileSelectedOnNav]?.code.join("\n") || "testinggg");

        } else {
          console.error('Error updating data:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating data:', error);
      }
    }


    else if (tutorial) {
      dispatchTutorial({ type: 'SET_OBJECTIFY_STATE_TUTORIAL', payload: true }); // or false
      console.log("Tutorial being objectified is:", isObjectifyingTutorial);
    }
  };

  const handleCodeChange = (newCode) => {
    setcode(newCode);
    if (project) {
      const updatedCodeFiles = codeFiles.map((file) => {
        if (file?.fileName === codeFiles[selectedFile]?.fileName) {
          return {
            fileName: file.fileName,
            code: newCode.split('\n'),
          };
        }
        return file;
      });
      setCodeFiles(updatedCodeFiles);
      dispatchCodeFiles({ type: 'UPDATE_CODE', payload:codeFiles});

      
    }


    
  };


  return (
    <div className={`${styles.defaultOutputContainer} ${customOutputContainer}`}>

      {/* <div className={styles.topbarFiles}> */}
      <button className={styles.explorebutton} onClick={handleObjectify}>
        <div className={styles.objectify}>Objectify</div>
        <img
          className={styles.icPlayArrow48pxIcon}
          alt=""
          src="/ic-play-arrow-48px.svg"
        />
      </button>

        <div className={styles.fileContainer}>
          {openFiles.length === 0 && (
            <div key={-1} className={`${styles.file}`} style={{ padding: '0px' }}>
            </div>
          )}

          {openFiles.map((fileName, index) => (
            <div key={index} className={`${styles.file} ${selectedFile === openFiles[index] ? styles.selected : ''}`} onClick={() => handleFileSelected(openFiles[index])}>
              <div className={styles.icon}>
                <img className={styles.vectorIcon} alt="" />
                <img className={styles.vectorIcon1} alt="" src="/vector5@2x.png" />
                <b className={styles.js}>J</b>
              </div>
              <div className={styles.mainjs}>{codeFiles[openFiles[index]]?.fileName}</div>
              <img
                className={styles.pagecrossIcon}
                alt=""
                src="/pagecross1.svg"
                onClick={() => handleCloseFile(openFiles[index])}
              />
            </div>

          ))}
        </div>



      <div className={styles.code}>
        <AceEditor
          padding=""
          right="400px"
          left="500px"
          height="827px"
          width="548px"
          mode="java"
          theme="dracula"
          name="editor"
          fontSize={14}
          editorProps={{ $blockScrolling: true }}
          value={code}
          onChange={(newCode) => handleCodeChange(newCode)}


        />
      </div>
      <div className={styles.frameParent}>
        <div className={styles.frameG65pxroup}>
          <div className={styles.outputWrapper}>
            <div className={styles.mainjs}>Output</div>
          </div>
        </div>
        <div className={styles.frameChild} />
      </div>
    </div>
  );
};

export default OutputContainer;
