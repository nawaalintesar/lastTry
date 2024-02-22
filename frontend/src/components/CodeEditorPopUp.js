import { useState } from "react";
import { Select, message } from "antd";
import styles from "./CodeEditorPopUp.module.css";
import { useProjectsContext } from "../hooks/useProjectsContext";
const CodeEditorPopUp = ({ onClose, onSave}) => {
  const [rectangleInputValue, setRectangleInputValue] = useState("");
  const { project, dispatch } = useProjectsContext();
  const [lang, setLang] = useState(...project?.project?.progLang);
  console.log("LANGUAGE", lang);
  const handleSave = async () => {
    const length = project?.project?.codeStates?.length;
    // Clone the existing codeStates to avoid mutating the state directly
    const updatedCodeStates = [...project?.project?.codeStates]; //codeStates
    let lang = project?.project?.progLang;
    console.log("LANGUAGE", lang)
    if (lang === "python") {
      lang= "py";
    }
    else if (lang === "c++") {
      lang="cpp";
    }
    const newFile = { fileName: rectangleInputValue + "." + lang, code: [""] };
    // Update the codeData array of the latest codeState
    updatedCodeStates[length - 1].codeData.push(newFile);


    dispatch({ type: 'UPDATE_PROJECT', payload: updatedCodeStates[length - 1].codeData });
    let headers = { 'Content-Type': 'application/json' };

    //updating the db
    const fetchUpdatedResponse = await fetch(`/api/projects/${project.project._id}`, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify({ codeData: updatedCodeStates[length - 1].codeData }),
    });
    if (fetchUpdatedResponse.ok) {
      console.log("Updated yes!");
    }
    else {
      console.log(updatedCodeStates[length - 1].codeData);
    }
    //fetch
    //body is Json.stringify project and this new element
    //then return update 
    onSave(rectangleInputValue);
    onClose();
  };
  const handleFileUpload = async (event) => {
    const files = event.target.files;
  
    if (files.length > 0) {
      // Define allowed file extensions
      let lang = project?.project?.progLang;
      console.log("LANGUAGE", lang)
      if (lang === "python") {
        lang= ".py";
      }
      else if (lang === "c++") {
        lang=".cpp";
      }
      else if (lang === "java"){
        lang= ".java";
      }
      const allowedExtensions = ['.txt', lang];
  
      // Iterate over each selected file
      for (const file of files) {
        // Check if the file's extension is allowed
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(`.${fileExtension}`)) {
          message.error(`File ${file.name} has an invalid extension. Only .cpp, .java, .py, and .txt files are allowed.`);
          continue; // Skip processing invalid files
        }
  
        const reader = new FileReader();
  
        reader.onload = async (e) => {
          const fileContent = e.target.result;
          const newFile = {
            fileName: file.name,
            code: fileContent.split("\n"),
          };
          const length = project?.project?.codeStates?.length;
          // Clone the existing codeStates to avoid mutating the state directly
          const updatedCodeStates = [...project?.project?.codeStates]; //codeStates
  
          // Update the codeData array of the latest codeState
          updatedCodeStates[length - 1].codeData.push(newFile);
  
          dispatch({ type: 'UPDATE_PROJECT', payload: updatedCodeStates[length - 1].codeData });
          let headers = { 'Content-Type': 'application/json' };
  
          //updating the db
          const fetchUpdatedResponse = await fetch(`/api/projects/${project.project._id}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({ codeData: updatedCodeStates[length - 1].codeData }),
          });
          if (fetchUpdatedResponse.ok) {
            console.log("Updated yes!");
          }
          else {
            console.log(updatedCodeStates[length - 1].codeData);
          }
          //fetch
          //body is Json.stringify project and this new element
          //then return update 
          onSave(file.name); // Pass the file name to the onSave function if needed
        };
  
        reader.readAsText(file);
      }
  
      onClose(); // Close the popup after processing all files
    } else {
      message.error("No files selected");
    }
  };
  
  return (
    <div className={styles.codeeditorpopup}>
      <div className={styles.codeeditorpopupChild} />
      <div className={styles.newFileDetails}>New File Details</div>
      <div className={styles.enterFileName}>Enter File Name</div>
      <div className={styles.div}>.</div>
      <input
        className={styles.codeeditorpopupItem}
        name="Enter Name"
        placeholder=" Name"
        type="text"
        value={rectangleInputValue}
        onChange={(event) => setRectangleInputValue(event.target.value)}
        padding-left="1.3rem"
      />
      <Select
        className={styles.chooselanguagedropdown}
        placeholder="ext"
        size="small"
        style={{ width: "70px" }}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        virtual={false}
      >
        {lang !== "c" ? (
          <Select.Option value="C++" disabled>
            cpp
          </Select.Option>
        ) : (
          <Select.Option value="C++">cpp</Select.Option>
        )}
        {lang !== "j" ? (
          <Select.Option value="Java" disabled>
            java
          </Select.Option>
        ) : (
          <Select.Option value="Java">java</Select.Option>
        )}
        {lang !== "p" ? (
          <Select.Option value="Python" disabled>
            py
          </Select.Option>
        ) : (
          <Select.Option value="Python">py</Select.Option>
        )}
      </Select>
      <div className={styles.or}>OR</div>
      <div className={styles.uploadAFile}>Upload a file</div>
      <input
        className={styles.codeeditorpopupInner}
        type="file"
        multiple
        colour="white"
        background-color="#4C4863"
        padding-left="1.3rem"
        onChange={handleFileUpload}
      />
      <div className={styles.buttonsave}>
        <div className={styles.button} onClick={onClose}>
          <div className={styles.save} onClick={handleSave}>Save</div>
        </div>
      </div>
      <div className={styles.buttoncancel} onClick={onClose}>
        <div className={styles.button} onClick={onClose}>
          <div className={styles.save}>Cancel</div>
        </div>
      </div>
      <img
        className={styles.pagecrossIcon}
        alt=""
        src="/pagecross2.svg"
        onClick={onClose}
      />
    </div>
  );
};

export default CodeEditorPopUp;
