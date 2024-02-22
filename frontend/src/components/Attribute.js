import React, { useState, useRef } from 'react';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import Draggable from 'react-draggable';
import { useCodeFilesContext } from '../hooks/useCodeFilesContext';


const Attribute = ({ id, attributeName, onDelete, style, onRename,isEncapsulated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newAttributeName, setnewAttributeName] = useState(attributeName);
  const newAttributeNameRef = useRef(attributeName); //to store the prev value
  const codeFiles = useCodeFilesContext();
  const { dispatch: dispatchCodeFiles } = useCodeFilesContext();

  console.log('idAttr', id);
  // const [newMethod, setnewMethod] = useState(attributeName);

  const handleAttributeNameChange = (event) => {
    setnewAttributeName(event.target.value);
  };


  const handleRename = () => {
    setIsEditing(false);

    const length = Object.keys(codeFiles?.state?.codeFiles || {}).length;
    for (let i = 0; i < length; i++) { //goes through number of code files

      const file = codeFiles.state.codeFiles[i];
      const updatedCode = [];
      for (let j = 0; j < Object.keys(file?.code || {}).length; j++) {
        const line = file.code[j];
        const updatedLine = line.replace(newAttributeNameRef.current, newAttributeName); //newAttributeNameRef.current hold the value of the last changed variable

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
    newAttributeNameRef.current = newAttributeName;
    console.log("Method name:", attributeName);

  };

  return (
    <div id={id} style={style}>
      {isEditing ? (
        <input
          type="text"
          value={newAttributeName}
          onChange={handleAttributeNameChange}
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
</span>
 
          <span onClick={() => setIsEditing(true)}>
            {isEncapsulated && <img className={style.lockIcon} alt="Lock" src="/public/lock.svg" />} {/* Render the gem icon if isEncapsulated is true */}
          {newAttributeName}
          </span>
         
        </>
      )}
    </div>
  );
  
};

export default Attribute;
