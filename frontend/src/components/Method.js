

import React, { useState, useRef } from 'react';
import { useCodeFilesContext } from '../hooks/useCodeFilesContext';

const Method = ({ id, methodName, onDelete, style }) => {
  console.log("idMethod", id);
  const [isEditing, setIsEditing] = useState(false);

  const [ newMethodName, setNewMethodName ] = useState(methodName);
  const newMethodNameRef = useRef(methodName); //to store the prev value
  const { dispatch: dispatchCodeFiles } = useCodeFilesContext();
  const codeFiles = useCodeFilesContext();
  const handleMethodNameChange = (event) => {
    setNewMethodName(event.target.value);
  };


  const handleRename = () => {
    setIsEditing(false);
    // Update the code files with the new method name
    const length = Object.keys(codeFiles?.state?.codeFiles || {}).length;
    for (let i = 0; i < length; i++) { //goes through number of code files

      const file = codeFiles.state.codeFiles[i];
      const updatedCode = [];
      for (let j = 0; j < Object.keys(file?.code || {}).length; j++) {
        const line = file.code[j];
        const updatedLine = line.replace(newMethodNameRef.current, newMethodName); //newMethodNameRef.current hold the value of the last changed variable

        updatedCode.push(updatedLine);
      }
      // Update the code of the current file with the updated code
      console.log("Before Changed", codeFiles.state.codeFiles[i].code);
      codeFiles.state.codeFiles[i].code = updatedCode;
      console.log("Changed", codeFiles.state.codeFiles[i].code)
    }

    // Dispatch an action to update the code files state
    dispatchCodeFiles({ type: 'UPDATED_CODE', payload: codeFiles });

    console.log("UPDATED CODE CONTEXT", codeFiles);

    // // Dispatch an action to update the code files state
    // codeFiles.dispatch({ type: 'UPDATE_CODE', payload: { codeFiles: updatedCodeFiles } });
    newMethodNameRef.current=newMethodName;

  };
  return (
    <div id={id} style={style}>
      {isEditing ? (
        <input
          type="text"
          value={newMethodName}
          onChange={handleMethodNameChange}
          onBlur={handleRename}
          autoFocus
          className="inputStyle"
        />
      ) : (
        <>
     <span
  onClick={onDelete}
  style={{
    cursor: 'pointer',
    color: 'black', // Initial color
    transition: 'color 0.1s', // Smooth transition effect
  }}
  onMouseEnter={(e) => { e.target.style.color = 'red'; }} // Change color on hover
  onMouseLeave={(e) => { e.target.style.color = 'black'; }} // Restore initial color
>
&#128465;&nbsp;
</span>          <span onClick={() => setIsEditing(true)}>{newMethodName} () </span>       
    
        </>
      )}
    </div>
  );
};

export default Method;
