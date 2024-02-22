import { Select } from "antd";
import styles from "./ProjectPopUPp.module.css";
import { useState, useCallback, useEffect, dispatch } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const ProjectPopUPp = ({ onClose }) => {
  const [rectangleInputValue, setRectangleInputValue] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [inputError, setInputError] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const {user} =useAuthContext();


  const navigate = useNavigate();
  const onFrameButtonClick = useCallback(() => {
    // Please sync "Code Editor- after login" to the project
    navigate("/CodeEditor");
  }, [navigate]);

  const handleCreate = async () => {
    if (!rectangleInputValue) {
      setInputError(true);
    } else {
      setInputError(false);
    }
  
    if (!selectedLanguage) {
      setSelectError(true);
    } else {
      setSelectError(false);
    }
  
    if (!rectangleInputValue || !selectedLanguage) {
      alert("Both fields are required!");
      return;
    }
  
    const projectDetails = {
      prjName: rectangleInputValue,
      progLang: selectedLanguage,
      // Add more fields as needed
    };
  
    

    try {
      console.log(projectDetails)
      console.log(user.token);
      const response = await fetch('/api/projects/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectDetails),
      });
        
      const responseData = await response.json();

      if (response.ok) {
        // Redirect to CodeEditor with the new project's ID
        navigate("/CodeEditor", { state: { ProjectId: responseData._id } });
      } else {
        // Handle error if the request fails
        console.error('Error creating project:', response);
        console.error("Error details",responseData)
      }
    } catch (error) {
      console.error('Error creating projects:', error);
    }
  };
  
  return (
    <div className={styles.projectPopUpp}>
      <div className={styles.projectPopUppChild} />
      <img
        className={styles.pagecrossIcon}
        alt=""
        src="/pagecross41.svg"
        onClick={onClose}
      />
      <div className={styles.frameParent}>
        <div className={styles.projectDetailsParent}>
          <div className={styles.projectDetails}>Project Details</div>
          <div className={styles.name}>Name</div>
          <input 
            className={`${styles.frameChild} ${inputError ? styles.inputError : ""}`}
            name="Enter Name"
            placeholder=" Name"
            type="text"
            value={rectangleInputValue}
            onChange={(event) => setRectangleInputValue(event.target.value)}
            required
            padding-left="1.3rem"
          />
          <div className={styles.name}>Choose Language</div>
          <Select 
            className={`${styles.javaParent} ${selectError ? styles.selectError : ""}`}
            placeholder="Choose language"
            style={{ width: "226px" }}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            virtual={false}
            showArrow={false}
            required 
            value={selectedLanguage}
            onChange={(value) => setSelectedLanguage(value)}
          >
            <Select.Option value="java">Java</Select.Option>
            <Select.Option value="c++">C++</Select.Option>
            <Select.Option value="python">Python</Select.Option>
          </Select>
        </div>
        <div className={styles.buttonsave}onClick={handleCreate}>
          <div className={styles.button} >
            <div className={styles.save}>Save</div>
          </div>
        </div>
        <div className={styles.buttoncancel} onClick={onClose}>
          <div className={styles.button1} onClick={onClose}>
            <div className={styles.save}>Cancel</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPopUPp;
