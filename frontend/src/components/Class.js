//CLASS
import React, { useEffect, useState } from 'react';
import { Handle } from 'react-flow-renderer';
import Method from './Method';
import Attribute from "./Attribute"
import { withTheme } from '@emotion/react';
import './Animation.css';
import { getRelationshipColor } from './relationshipColors';
import { getParentClassMethods, saveParentClassMethods } from './parentClassData';
import { getInheritanceAbstractRelationships } from './relationshipData';


const Class = ({ data, isConnectable, methodOverridingRelationships, onRename, methodOverloadingRelationships, AllRelationships, addClass }) => {
  const inheritanceWithAbstract = getInheritanceAbstractRelationships();
  console.log("POPOOP", inheritanceWithAbstract, inheritanceWithAbstract.target)
  let methodArray = [];
  let attributeArray = [];

  const boxStyle = {
    //... other styles
    '--box-border-color': getRelationshipColor(data.name),
    '--box-background-color': getRelationshipColor(data.name),
    // ... other styles
  };

  console.log("DATA:", data)
  const isAbstract = inheritanceWithAbstract.some(rel => rel.target === data.name)
  //const isAbstract = data.methods && data.methods.some(attr => attr.access_modifier === 'abstract');

  console.log("ABSTRACT IN CLAS:", isAbstract)
  console.log("ALL RELATIO in class:", AllRelationships)

  const classBoxy = {
    backgroundColor: getRelationshipColor(data.name),
    color: 'black',
    // backgroundColor: isAbstract ? 'black' : getRelationshipColor(data.name),
    // color: 'black',
  }

  //will make the gray at the end into a black box
  const BOX = {
    //  background: isAbstract
    //    ? 'green'
    //    : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))'
  };

  //console.log("In class", methodOverridingRelationships);
  // const initialMethods = data.methods ? data.methods.map(method => ({ id: method._id, name: method.name })) : [];
  const [methodcChildren, setMethodChildren] = useState(data.methods ? data.methods.map(method => ({ id: method._id, name: method.name })) : []);

  // const [methodcChildren, setMethodChildren] = useState(data.methods ? data.methods.map((method) => method.name) : []);
  const [attributeChildren, setAttributeChildren] = useState(data.attributes ? data.attributes.map((attribute) => ({ name: attribute.name, id: attribute._id })) : []);
  const [isEditing, setIsEditing] = useState(false);
  const [newClassName, setNewClassName] = useState(data.name);
  // -------------------Methods---------------------
  const [addMethodCounter, setAddMethodCounter] = useState(1);
  const handleDeleteMethodChild = (childId) => {
    const updatedChildren = methodcChildren.filter((method) => method.id !== childId);
    setMethodChildren(updatedChildren);
    console.log('methodcChildren', methodcChildren);

  };
  const handleAddMethodChild = () => {
    const newMethodId = `method${addMethodCounter}`;

    const newMethod = {
      id: newMethodId,
      name: `newMethod ${addMethodCounter}`, // Default name for the new method
      //access_modifier: "public", // Default access modifier for the new method
      //  parameters: [],

    };
    setMethodChildren([...methodcChildren, newMethod]);
    setAddMethodCounter(addMethodCounter + 1);
    console.log('methodcChildren', methodcChildren);

  };
  // ----------------Attributes-----------------
  const [addAttributeCounter, setAddAttributeCounter] = useState(1);
  const handleAddAttributeChild = () => {
    const newAttributeId = `attribute${addAttributeCounter}`;
    const newAttribute = {
      id: newAttributeId,
      name: `newAttribute ${addAttributeCounter}`, // Default name for the new attribute
      access_modifier: "public", // Default access modifier for the new attribute
      type: "string", // Default type for the new attribute
    };
    setAttributeChildren([...attributeChildren, newAttribute]);
    setAddAttributeCounter(addAttributeCounter + 1);
  };

  const handleDeleteAttributeChild = (childIdToDelete) => {
    const updatedChildren = attributeChildren.filter((child) => child.id !== childIdToDelete.id);
    console.log('childIdToDelete', childIdToDelete);
    setAttributeChildren(updatedChildren);
  };



  // ----------------Change Class Name ---------
  const handleClassNameChange = (event) => {
    setNewClassName(event.target.value);
  };

  const handleRename = () => {
    setIsEditing(false);
    // Call the onRename callback with the old class name and the new class name
    console.log("newclassname", newClassName)
    data.name = newClassName
    // onRename(data.name, newClassName);
  };
  const mergeStyles = (style1, style2) => {
    return { ...style1, ...style2 };

  };

  let currMethod = '';



  const formatOverloadedMethod = (methodName) => {

    let overLoadingRelationship = '';
    for (let i = 0; i < methodOverloadingRelationships.length; i++) {
      const relationship = methodOverloadingRelationships[i];
      const sourceParts = relationship.source.name.split("."); // Classname.methodname
      const targetParts = relationship.target.name.split(".");

      if (data.name === sourceParts[0] && methodName === sourceParts[1].split("(")[0] && sourceParts[1].split("(")[0] === targetParts[1].split("(")[0]) {
        console.log("Hello");
        var parameters = '';
        if (currMethod !== sourceParts[1]) {
          parameters = sourceParts[1]
            .match(/\('([^']+)', '([^']+)'\), \('([^']+)', '([^']+)'\)/)
            .slice(1);
          currMethod = sourceParts[1];
        } else {
          parameters = targetParts[1]
            .match(/\('([^']+)', '([^']+)'\), \('([^']+)', '([^']+)'\)/)
            .slice(1);
          currMethod = targetParts[1];
        }

        // Formatting the parameters
        const formattedParameters = [];
        for (let j = 0; j < parameters.length; j += 2) {
          const [name, type] = parameters.slice(j, j + 2);
          formattedParameters.push(`${type} ${name}`);
        }

        // Constructing the final formatted string
        const formattedString = `${sourceParts[1].split("(")[0]}(${formattedParameters.join(', ')})`;
        overLoadingRelationship = formattedString;
      }
    }


    if (overLoadingRelationship.length > 0) {
      console.log("Here", overLoadingRelationship);
      console.log("Here", overLoadingRelationship);
    } else {
      //console.log("No overloading relationships found");
      overLoadingRelationship = methodName; // Return the original methodName if no relationships were found
    }

    //console.log("Here", overLoadingRelationship);
    return overLoadingRelationship || methodName; // Return either the formatted string or the original methodName
  };


  let target;
  let classname;
  let parentClass;
  let colorForClass;
  inheritanceWithAbstract.forEach((relationship, index) => {
    if (index === 0) {
      // Set target to the first value during the first iteration
      target = relationship.target;
      console.log('Target value (first iteration):', target);
      classname = target; // Example class name
      colorForClass = getRelationshipColor(classname);
      console.log(`Color for ${classname}:`, colorForClass);
      const parentClassName = target;
      let parentClass = data.name === parentClassName ? data : null;
      if (parentClass) {
        // Iterate over parent class methods
        parentClass.methods.forEach(method => {
          // Check if the method already exists in methodArray
          methodArray.push({ name: method.name, color: getRelationshipColor(data.name) });
        });
        saveParentClassMethods(methodArray);
      }

    } else {
      // Set target to the second value during subsequent iterations
      target = relationship.target;
      methodArray = getParentClassMethods();
      console.log("Reached else", methodArray)
      console.log('Target value (iteration', index + 1, '):', target);

      classname = target; // Example class name
      colorForClass = getRelationshipColor(classname);
      console.log(`Color for ${classname}:`, colorForClass);
      const parentClassName = target;
      let parentClass = data.name === parentClassName ? data : null;
      if (parentClass) {
        // Iterate over parent class methods
        parentClass.methods.forEach(method => {
          // Check if the method already exists in methodArray
          const existingMethodIndex = methodArray.findIndex(item => item.name === method.name);
          if (existingMethodIndex === -1) {
            // If the method doesn't exist, add it to methodArray with its color
            methodArray.push({ name: method.name, color: getRelationshipColor(data.name) });
          }
        })
        console.log("METHOD AFTER:", methodArray)
        saveParentClassMethods(methodArray);


      }
    }
  });


  const getAttributeStyle = (attributeName) => {


    //gettign cass clolour for the others
    const calssnamee = data.name; // Example class name
    const color = getRelationshipColor(calssnamee);

    // If the method name is "hasAccess", apply a black style; otherwise, apply pink
    const style = {
      background: color,
      position: 'relative',
      boxShadow: '0px 4px 24px 1px rgba(35, 16, 94, 0.25)',
      backdropFilter: 'blur(7.5px)',
      padding: '7px 40px 7px 40px',
      borderRadius: '9px',
      borderImage: 'linear-gradient(to bottom, #a3d4a3, #fff) 1',
      margin: '3px 5px',
      fontFamily: 'var(--font-poppins)',
      color: 'black',
      ".lockIcon": {
        height: '20px', // Example height value
        width: '20px',  // Example width value
      }
    };

    return {
      style: style,
    };
  };



  const getMethodStyle = (methodName, dataName) => {
    console.log('Method namw', methodName)
    const formattedMethodName = methodName;

    // const parentClassMethods = getParentClassMethods(data, methodName);
    // console.log("parentClassMethods:", parentClassMethods);
    let isHasAccessMethod;
    let colorForMethod;
    const parentClassMethods = getParentClassMethods(data, methodName);
    console.log("parentClassMethods:", parentClassMethods);


    // Iterate over the parent class methods array
    for (const methodObj of parentClassMethods) {
      if (methodObj.name === methodName) {
        // Method exists in parent class methods
        colorForMethod = methodObj.color;
        isHasAccessMethod = true;
        console.log("Color for method:", colorForMethod);
        // Now you can use colorForMethod for further processing
        break; // Exit the loop since we found the method
      }
    }

    if (!colorForMethod) {
      // Method does not exist in parent class methods
      isHasAccessMethod = false;
      console.log("Method does not exist in parent class methods.");
      // Optionally, you can set a default color if the method doesn't exist
      // colorForMethod = DEFAULT_COLOR;
    }

    //gettign cass clolour for the others
    const calssnamee = data.name; // Example class name
    const color = getRelationshipColor(calssnamee);

    // If the method name is "hasAccess", apply a black style; otherwise, apply pink
    const style = isHasAccessMethod ? {


      position: 'relative',
      boxShadow: '0px 4px 24px 1px rgba(35, 16, 94, 0.25)',
      backdropFilter: 'blur(7.5px)',
      padding: '7px 40px 7px 40px',
      borderRadius: '9px',
      borderImage: 'linear-gradient(to bottom, #a3d4a3, #fff) 1',
      margin: '3px 5px',
      fontFamily: 'var(--font-poppins)',
      background: colorForMethod,
      color: 'black',
    } : {
      background: color,
      position: 'relative',
      boxShadow: '0px 4px 24px 1px rgba(35, 16, 94, 0.25)',
      backdropFilter: 'blur(7.5px)',
      padding: '7px 40px 7px 40px',
      borderRadius: '9px',
      borderImage: 'linear-gradient(to bottom, #a3d4a3, #fff) 1',
      margin: '3px 5px',
      fontFamily: 'var(--font-poppins)',
      color: 'black',
    };


    return {
      style: style,
      displayMethodName: formattedMethodName,
    };
  };

  // Calculate the height of the attribute container based on the number of attributes
  const attributeContainerHeight = data.attributes ? `${data.attributes.length * 80}px` : 'auto';

  // Calculate the height of the method container based on the number of methods
  const methodContainerHeight = data.methods ? `${data.methods.length * 80}px` : 'auto';


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="boxStyle" style={BOX}>

        {console.log(isEditing)}
        {isEditing ? (<>
          <input
            type="text"
            value={newClassName}
            onChange={handleClassNameChange}
            onBlur={handleRename}
            autoFocus
            className="inputStyleForClass"
          /><br /></>
        ) : (
          <p className="classBoxParent" style={classBoxy} onClick={() => setIsEditing(true)}>
            {newClassName}
          </p>
        )}

        <span className="addButton" onClick={() => handleAddAttributeChild()}>+</span>
        <strong style={{marginLeft:"8px"}}>Attributes:</strong> <br/>





        {attributeChildren.length > 0 && (
          <>
            <div className="attributeScroll" style={{ '--custom-variable': getRelationshipColor(data.name) }}>
              {attributeChildren.map((attribute) => {
                const { style } = getAttributeStyle(attribute.name);
                console.log("Attributes are:", attribute.name, style);
                const isEncapsulated = attribute.access_modifier == 'private';
                return (
                  <Attribute
                    id={attribute.id}
                    key={attribute.id}
                    attributeName={attribute.name}
                    style={style}
                    isEncapsulated={isEncapsulated}
                    onDelete={() => handleDeleteAttributeChild(attribute)
                    } />
                );
              })}

            </div>
          </>
        )}


        <span className="addButton" onClick={() => handleAddMethodChild()}>+</span>
        <strong style={{marginLeft:"8px"}}>Method:</strong> <br/>

        {methodcChildren.length > 0 && (
          <>
            <div className="methodScroll" style={{ '--custom-variable': getRelationshipColor(data.name) }} >
              {methodcChildren.map((method) => {
                const { style, displayMethodName } = getMethodStyle(method.name);
                console.log("Displaying:", displayMethodName)

                return (
                  <Method
                    key={method.id} // Using the method's id as the key
                    methodName={method.name}
                    onDelete={() => handleDeleteMethodChild(method.id)} // Pass the method's id to the handler
                    style={style}
                    id={method.id} // Pass the method's id as a prop to the Method component
                  />
                );
              })}
            </div>
          </>
        )}

        <Handle type="source" position="top" isConnectable={isConnectable} />
        <Handle type="target" position="bottom" isConnectable={isConnectable} />
        <div className="sideButtons" style={{ position: 'absolute', top: '50%', left: '-70px', transform: 'translateY(-50%)', width: 'auto', height: 'auto', lineHeight: '100px' }} onClick={() => addClass(data.name, 0)} > &#9608;&#9608;&nbsp;&#11013;</div>
        <div className="sideButtons" style={{ position: 'absolute', top: '50%', right: '-70px', transform: 'translateY(-50%)', width: 'auto', height: 'auto', lineHeight: '100px' }} onClick={() => addClass(data.name, 0)} >&#11157;&nbsp;&#9608;&#9608; </div>
        <div className="sideButtons" style={{ position: 'absolute', top: '-105px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={() => addClass(data.name, 1)} >
          <span style={{ fontSize: '12px' }} >Parent</span>
          <span>&#9608;&#9608;</span>
          <span>&#11014;</span>
        </div>
        <div className="sideButtons" style={{ position: 'absolute', bottom: '-105px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={() => addClass(data.name, 2)}>
          <span>&#11015;</span>

          <span>&#9608;&#9608;</span>
          <span style={{ fontSize: '12px' }} >Child</span>

        </div>

      </div>


    </div>

  );


};
export default Class;
