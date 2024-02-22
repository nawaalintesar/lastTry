import { useEffect, useState, useCallback } from "react";
import CodeEditorPopUp from "./CodeEditorPopUp";
import PortalPopup from "./PortalPopup";
import IconfileMd from "./IconfileMd";
import styles from "./FileNavigationContainer.module.css";
import PropTypes from "prop-types";

import { useProjectsContext } from "../hooks/useProjectsContext";
import { useAuthContext } from "../hooks/useAuthContext";


const FileNavigationContainer = ({ customClassName, project, tutorial, levelClicked, language, fileSelectedOnNav, updatedFileSelected }) => {
  const [isCodeEditorPopUpOpen, setCodeEditorPopUpOpen] = useState(false);
  const [fileNames, setFileNames] = useState([]);
  const [codeFiles, setCodeFiles] = useState([]); // State to track files and their code for projects
  const [selectedFile, setSelectedFile] = useState(null);
  const { dispatch } = useProjectsContext();
const user = useAuthContext();
  const openCodeEditorPopUp = useCallback(() => {
    if (project) {
      setCodeEditorPopUpOpen(true);
    }
  }, [project]);

  const closeCodeEditorPopUp = useCallback((fileName) => {
    if (project) {
      setCodeEditorPopUpOpen(false);
    }
  }, []);

  useEffect(() => {
    if (tutorial) {
      const levelClickedNumber = parseInt(levelClicked, 10);
      const filteredLevels = tutorial.level.filter((level) => level.progLang === language);
      const clickedLevel = filteredLevels[levelClickedNumber - 1];
      const fileNamesFromTutorial = clickedLevel ? clickedLevel.codeData.map((data) => data.fileName) : [];
      setFileNames(fileNamesFromTutorial);
      console.log('Tuts', fileNamesFromTutorial);
    }
    else if (project) {

      const codeState = project?.project?.codeStates?.[project.project.codeStates.length - 1];
      const fileNamesFromProject = codeState ? codeState.codeData.map((data) => data.fileName) : [];
      setFileNames(fileNamesFromProject);
      console.log("Prjs:", fileNamesFromProject)
      
    }
    const filteredFileNames = [fileSelectedOnNav];
      const newCodeFiles = filteredFileNames.map((fileName) => ({
        fileName,
        code: project?.project?.codeStates?.[project.project.codeStates.length - 1]?.codeData[fileSelectedOnNav]?.code.join('\n') || ''
      }));

      setCodeFiles((prevCodeFiles) => {
        const uniqueCodeFiles = [...prevCodeFiles, ...newCodeFiles].filter((codeFile, index, self) =>
          index === self.findIndex((c) => c.fileName === codeFile.fileName)
        );
        return uniqueCodeFiles;
      });
      if (updatedFileSelected !== fileSelectedOnNav) {
        handleFileClick(updatedFileSelected);
        console.log("filenav, updated file from output", selectedFile)
      }

  }, [tutorial, levelClicked, language, project, fileSelectedOnNav, updatedFileSelected]);

  console.log("WHOA RE U", fileNames)
  // const handleFileClick = (index) => {
  //   setSelectedFile(index);
  // };
  const handleFileClick = (index) => {
    console.log("HANDLE FILE CLCIKEDDDD");
    setSelectedFile(index);
    console.log("index", index)
    fileSelectedOnNav(index); // Pass the selected file name to the parent component
  };

  const handleFileDelete = async (index) => {
    // Update the project data to reflect the deletion
    if (project) {
      // Clone the existing codeStates to avoid mutating the state directly
      const updatedCodeStates = [...project?.project?.codeStates];
      const length = project?.project?.codeStates?.length;
      // Remove the file from the codeData array of the latest codeState
      updatedCodeStates[length - 1].codeData.splice(index, 1);
      let headers = {'Content-Type': 'application/json'};
      if (project.project._id !== "65d57921b81b7f5c349e0705" && user.user.userEmail) {
        headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.user.token}` };
      }

      dispatch({ type: 'UPDATE_PROJECT', payload: updatedCodeStates[length - 1].codeData });
  
      // Update the API/database
      const fetchUpdatedResponse = await fetch(`/api/projects/${project.project._id}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ codeData: updatedCodeStates[length- 1].codeData }),
      });
  
      if (fetchUpdatedResponse.ok) {
        console.log("File deleted successfully!");
      } else {
        console.log("Error deleting file");
      }
  

    }
  };
  

  return (
    <>
      <div className={`${styles.defaultFileNavigation} ${customClassName}`}>
        <div className={styles.browser}>
          <div className={styles.project}>
            <div className={styles.button} />
            <div className={styles.myoopproject}>{project?.project?.prjName}</div>
          </div>
          <div className={styles.fileContainer}>
            {fileNames.map((fileName, index) => (
              <div
                key={index}
                className={`${styles.file} ${selectedFile === index ? styles.selected : ''}`}
                onClick={() => {
                  handleFileClick(index);
                  // Pass the selected file name to the parent component
                }}
              >
                <div
                  className={styles.deleteIcon}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent file click event from triggering
                    handleFileDelete(index);
                  }}
                >
                  <img src="/delete.png" alt="Delete" />
                </div>
                <div className={styles.nodeModules}>{fileName}</div>

              </div>
            ))}

          </div>
        </div>

        <div className={styles.folder2}>
          <img className={styles.icon1} alt="" src="/icon7@2x.png" />
          <div className={styles.nodeModules}>File</div>
        </div>
        <button
          className={styles.image14}
          id="buttonForAddingFile"
          onClick={openCodeEditorPopUp}
        />
      </div>

      {isCodeEditorPopUpOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={() => closeCodeEditorPopUp()}
        >
          <CodeEditorPopUp
            projId={project?.project?.projId}
            onClose={() => closeCodeEditorPopUp()}
            onSave={(fileName) => closeCodeEditorPopUp(fileName)}
          />
        </PortalPopup>
      )}
    </>
  );
};




export default FileNavigationContainer;