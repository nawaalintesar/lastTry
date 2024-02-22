//ANIMATION
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import ReactFlow, { addEdge, updateEdge, Background, Controls, Handle, MiniMap } from 'react-flow-renderer';
import { useNodesState, useEdgesState, MarkerType } from 'reactflow';
import { useAuthContext } from '../hooks/useAuthContext';
import Class from './Class';
import "./Animation.css"
import { setRelationshipColors } from './relationshipColors';

import { saveDataToRelationshipData } from './relationshipData';

let methodOverridingRelationships = [];
let methodOverloadingRelationships = [];
var addClass;
var addClass;

const nodeTypes = {
  custom: (props) => <Class {...props} methodOverridingRelationships={methodOverridingRelationships} methodOverloadingRelationships={methodOverloadingRelationships} addClass={addClass} />,
  //interface: (props) => <InterfaceClass {...props} />,
};


const AnimationDatabase = ({ projId, tutId, level, proj }) => {
  const user = useAuthContext();
  const [elements, setElements] = useState([]);
  const initialNodes = [];
  const initialEdges = [];
  const [AllRelationship, setAllRelationship] = useState([]);
  const inheritanceWithAbstract = [];
  //const [inheritanceRelationships, setInheritanceRelationships] = useState([]);

  const [abstractClassNames, setAbstractClassNames] = useState([]);
  const [defaultElementCounter, setdefaultElementCounter] = useState(0);
  var isSourceAbstract = [];
  // Declare a variable to store the parent class name
  const parentClassNames = [];


  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  // Declare inheritanceRelationships and newEdges outside the fetchData function
  var inheritanceRelationships = [];
  var AllRelationships = [];
  var newEdges = [];

  const edgeUpdateSuccessful = useRef(true);
  const createDefaultElement = (position) => {

    setdefaultElementCounter(defaultElementCounter + 1);
    const id = `defaultElement_${defaultElementCounter}`; // Use the counter value to generate ID
    return {
      id: id,
      data: {
        name: `defaultElement_${defaultElementCounter}`,
        attributes: [],
        methods: [],
      },
      position: { x: 0, y: 0 }, //change position later *
      type: 'custom',
      sourcePosition: 'right',
      targetPosition: 'left',
      className: 'DefaultElement',
    };
  };
  const createNewEdge = (sourceClass, defaultElement, number) => {
    if (number == 1) {
      return {
        id: `${sourceClass}-${defaultElement.name}`,
        target: sourceClass,
        source: defaultElement.id,
        type: 'step',
        animated: true,
        style: { stroke: '#FC0FC0' },
      };
    }
    else if (number == 2) {
      return {
        id: `${sourceClass}-${defaultElement.name}`,
        source: sourceClass,
        target: defaultElement.id,
        type: 'step',
        animated: true,
        style: { stroke: '#FC0FC0' },
      };
    }
  };





  // Function to add a default element to the elements state
  const addDefaultElement = (sourceClass, number) => {
    const defaultElement = createDefaultElement();
    if (number != 0) {
      const newEdge = createNewEdge(sourceClass, defaultElement, number);
      setEdges((prevEdges) => [...prevEdges, newEdge]);
    }
    setElements((prevElements) => [...prevElements, defaultElement]);
  };

  addClass = addDefaultElement;

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {

        if (projId) {
          let headers = {};
          if (projId !== "65d57921b81b7f5c349e0705" && user.user.userEmail) {
            headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.user.token}` };
          }
          const response = await fetch(`/api/projects/${projId}`, {
            method: 'GET',
            headers: headers

          });


          if (!response.ok) {
            console.error('Failed to fetch. Status:', response.status);
            return;
          }

          const data = await response.json();
          console.log("data", data)
          if (!data || !Array.isArray(data.project.codeStates)) {
            console.error('Invalid response format. Expected an array of classes.');
            console.error('Actual Data:', data); // Log the entire data
            return;
          }

          console.log("dataaaa", data)

          // Adjust the data structure to include name, attributes, and methods

          const elementsArray = data.project.codeStates.slice(-1).flatMap((codeState, index) => {
            const classes = codeState.classes;
            const relationships = codeState.relationships;
            console.log("RELATion", relationships);

            inheritanceRelationships = relationships
              .filter((relationship) =>
                relationship.type === "inheritance" &&
                relationship.target &&
                relationship.target.type === "class"
              )
              .map((relationship) => ({
                source: {
                  type: relationship.source.type,
                  name: relationship.source.name,
                },
                target: {
                  type: relationship.target.type,
                  name: relationship.target.name,
                },
              }));


            newEdges = inheritanceRelationships.map(({ source, target }) => ({
              id: `${source.name}-${target.name}`, // Unique identifier for the edge
              source: `${source.name}`, // ID of the source node
              target: `${target.name}`, // ID of the target node
              //type: 'step', // You can use 'straight' for straight lines
              animated: true, // Add animation if needed
              markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 40,
                height: 40,
                color: '#FF0072',
              },
              style: { stroke: '	#FC0FC0' }, // Customize the line style
              arrowHeadType: 'arrow',
            }));

            console.log("NE", newEdges);

            setEdges(newEdges);

            const updatedColors = {};

            AllRelationships = relationships
              .map((relationship) => ({
                source: {
                  type: relationship.source.type,
                  name: relationship.source.name,
                },
                target: {
                  type: relationship.target.type,
                  name: relationship.target.name,
                },
                type: {
                  type: relationship.type
                }
              }));

            AllRelationships.forEach(({ target, source, type }) => {
              // Generate random colors for source and target
              const randomColor = getRandomColor();

              setAllRelationship(AllRelationship);


              // Identify abstract classes , store them in an array calle dinheritancewithabstract
              // use a variable called usedColors to store the colour of the class

              const abstractClasses = relationships.filter(rel => rel.type === 'abstract class');
              const usedColors = {};

              relationships.forEach(rel => {
                if (type.type === 'implements' || type.type==='interface') {
                  inheritanceWithAbstract.push({
                    source: source.name,
                    target: target.name,
                    type: target.type
                  });
                  // Check if target color has not been assigned
                  const randomColor1 = getRandomColor();
                  updatedColors[source.name] = randomColor1; // Update target color only if it's not already assigned

                  // Check if target color has not been assigned
                  const randomColor = getRandomColor();
                  updatedColors[target.name] = randomColor; // Update target color only if it's not already assigned

                }
                else if (rel.type === 'inheritance') {
                  console.log("RECHECK THE INHERITANCE")
                  isSourceAbstract = abstractClasses.some(abstract => abstract.source.name === rel.target.name);
                  console.log("isABSTRACT: ", isSourceAbstract)

                  // Set abstract class names state
                  setAbstractClassNames(abstractClassNames);
                  if (isSourceAbstract) {
                    inheritanceWithAbstract.push({
                      source: rel.source.name,
                      target: rel.target.name,
                      type: rel.type
                    });
                    console.log("Abstract and Inheritance Color Reached")
                    if (!usedColors[rel.source.name]) {
                      const randomColor1 = getRandomColor();
                      updatedColors[rel.source.name] = randomColor1;
                      const randomColor = getRandomColor();
                      usedColors[rel.source.name] = randomColor;
                    } else {
                      updatedColors[rel.source.name] = usedColors[rel.source.name];
                    }
                    updatedColors[rel.target.name] = 'grey'; // Assuming 'grey' is the color for abstract classes
                    console.log("UPDATED COLORS in Inheritance and Abstract: ", updatedColors);
                  }
                }
                saveDataToRelationshipData({ inheritanceWithAbstract });
              });

              if (type.type === 'inheritance') {
                console.log("REach inheri")
                if (!(source.name in updatedColors)) {
                  const randomColor = getRandomColor();
                  updatedColors[source.name] = randomColor;
                }
                if (!(target.name in updatedColors)) {
                  const randomColor = getRandomColor();
                  updatedColors[target.name] = randomColor;
                }
                inheritanceWithAbstract.push({
                  source: source.name,
                  target: target.name,
                  type: type.type
                });

              }

              else {
                if (!(source.name in updatedColors)) { // Check if target color has not been assigned
                  updatedColors[source.name] = randomColor; // Update target color only if it's not already assigned
                }
                if (!(target.name in updatedColors)) { // Check if target color has not been assigned
                  updatedColors[target.name] = randomColor; // Update target color only if it's not already assigned
                }
              }
              console.log("MY VALUES FR FR 1:", inheritanceWithAbstract)
              saveDataToRelationshipData({ inheritanceWithAbstract });
            });


            // if (inheritanceWithAbstract.length > 0) {
            //   for (const relationship of inheritanceWithAbstract) {
            //     parentClassNames.push(relationship.target);
            //   }
            // }

            // Store the parent class names
            if (inheritanceWithAbstract.length > 0) {
              for (const relationship of inheritanceWithAbstract) {
                const parentName = relationship.target;
                if (!parentClassNames.includes(parentName)) {
                  parentClassNames.push(parentName);
                }
              }
            }


            console.log("PARENT CLASS", parentClassNames)
            console.log("UPDATED COLORS: ", updatedColors);

            function getRandomColor() {
              const letters = '89ABCDEF';
              let color = '#';

              do {
                color = '#'; // Reset color
                for (let i = 0; i < 6; i++) {
                  color += letters[Math.floor(Math.random() * letters.length)];
                }
              } while (!isLightColor(color));

              return color;
            }

            // Function to check if a color is light
            function isLightColor(color) {
              const hex = color.replace('#', '');
              const rgb = parseInt(hex, 16); // Convert hex to decimal
              const r = (rgb >> 16) & 0xff; // Extract red component
              const g = (rgb >> 8) & 0xff; // Extract green component
              const b = (rgb >> 0) & 0xff; // Extract blue component

              // Calculate luminance (perceived brightness)
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

              return luminance > 0.5;
            }
            setRelationshipColors(updatedColors);


            if (Array.isArray(classes) && classes.length > 0) {

              return classes.map((classItem, classIndex) => {
                const isParent = parentClassNames.includes(classItem.name);
                console.log("PARENT IN FUNCC:", isParent, classItem.name);
                console.log("METHODS:", classItem.methods)
                let longestMethodName = "";
                classItem.methods.forEach(method => {
                  if (method.name.length > longestMethodName.length) {
                    longestMethodName = method.name;
                  }
                });

                console.log("Longest method name:", longestMethodName);
                let x, y;
                // if (isParent) {
                //   // Set x and y for parent classes
                //   x = (index) + 450 + index * (280);
                //   y = (index) * 50;
                // } else {
                //   // Set x and y for child classes
                //   const gap = longestMethodName.length * index*index*index ;
                //   x = (index + 1) + index * 250 + gap;
                //   y = (index) + index + 1 * (450); // Adjust the y position as needed
                // }

                //   let x, y;
                if (isParent) {
                  // Set x and y for parent classes
                  x = (index) + 650 + classIndex * (280);
                  y = (index - 1) * 50;
                } else {
                  // Set x and y for child classes
                   const gap = longestMethodName.length * index*index*index 
                  // x = (index + 1) + classIndex * 400 + gap;
                  //const gap = longestMethodName.length * (index + 1) * (index + 1); // Adjusted gap calculation
                  x = (classIndex + 1) + gap + classIndex * 370  ;
                  y = (index + 1) + classIndex + 1 * (400); // Adjust the y position as needed
                }
                // const x = index * 200; // Adjust x position as needed
                // const y = index * 50; // Adjust y position as needed
                return {
                  id: `${classItem.name}`,
                  data: {
                    name: classItem.name,
                    attributes: classItem.attributes || [],
                    methods: classItem.methods || [],
                  },
                  position: { x, y }, //change position later *
                  type: 'custom',
                  sourcePosition: 'right',
                  targetPosition: 'left',
                  className: classItem.name,

                };
              });
            } else {
              console.error(`No classes found for codeState at index ${index}`);
              return [];
            }


          }).filter(element => element !== null);

          setElements(elementsArray || []);
        } else if (tutId) {
          console.log("TUTORIAL ANIM", level.classes);
          console.log("TUOOOOOLLLS", level.relationships);

          const relationships = level.relationships;
          console.log("RELATion", relationships);

          //defining inheritence relationship to use and create connections between children and parents class
          inheritanceRelationships = relationships
            .filter((relationship) =>
              relationship.type === "inheritance" &&
              relationship.target &&
              relationship.target.type === "class"
            )
            .map((relationship) => ({
              source: {
                type: relationship.source.type,
                name: relationship.source.name,
              },
              target: {
                type: relationship.target.type,
                name: relationship.target.name,
              },
              type: {
                type: relationship.type
              }
            }));


          //defining all relationships array and storing source,target and type
          AllRelationships = relationships
            .map((relationship) => ({
              source: {
                type: relationship.source.type,
                name: relationship.source.name,
              },
              target: {
                type: relationship.target.type,
                name: relationship.target.name,
              },
              type: {
                type: relationship.type
              }
            }));

          //Creating connection between parent and child class 
          newEdges = inheritanceRelationships.map(({ source, target, type }) => ({
            id: `${source.name}-${target.name}`,
            source: `${source.name}`,
            target: `${target.name}`,
            arrowHeadType: 'arrow',
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 40,
              height: 40,
              color: '#FF0072',
            },
            animated: true,
            style: { stroke: '	#FC0FC0' },
          }));

          setEdges(newEdges);



          const updatedColors = {};

          AllRelationships.forEach(({ target, source, type }) => {
            // Generate random colors for source and target
            const randomColor = getRandomColor();

            setAllRelationship(AllRelationship);


            // Identify abstract classes , store them in an array calle dinheritancewithabstract
            // use a variable called usedColors to store the colour of the class
            const abstractClasses = relationships.filter(rel => rel.type === 'abstract class');
            const usedColors = {};

            relationships.forEach(rel => {
              const randomColor = getRandomColor();

              if (rel.type === 'inheritance') {
                isSourceAbstract = abstractClasses.some(abstract => abstract.source.name === rel.target.name);
                // Set abstract class names and if abstract exists then we add values into our array
                setAbstractClassNames(abstractClassNames);
                if (isSourceAbstract) {
                  inheritanceWithAbstract.push({
                    source: rel.source.name,
                    target: rel.target.name,
                    type: rel.type
                  });
                  //randomizing the color
                  if (!usedColors[rel.source.name]) {
                    // If color not assigned for this source, assign a random color
                    // Function to generate random color
                    const randomColor = getRandomColor();

                    updatedColors[rel.source.name] = randomColor;
                    usedColors[rel.source.name] = randomColor;
                  } else {
                    updatedColors[rel.source.name] = usedColors[rel.source.name];
                  }
                  updatedColors[rel.target.name] = 'grey'; // Assuming 'grey' is the color for abstract classes
                }
              }
            });

            saveDataToRelationshipData({ inheritanceWithAbstract });
            if (type.type === 'inheritance') {
              if (!(source.name in updatedColors)) {
                const randomColor = getRandomColor();
                updatedColors[source.name] = randomColor;
              }
              if (!(target.name in updatedColors)) {
                const randomColor = getRandomColor();
                updatedColors[target.name] = randomColor;
              }
              inheritanceWithAbstract.push({
                source: source.name,
                target: target.name,
                type: type.type
              });
            }
            else if (type.type === 'implements') {
              console.log("Reached the interface area:")
              inheritanceWithAbstract.push({
                source: source.name,
                target: target.name,
                type: target.type
              });
              console.log("Reached the interface area inheritance arrau:", inheritanceWithAbstract)

              if (!(source.name in updatedColors)) {
                const randomColor = getRandomColor();
                updatedColors[source.name] = randomColor;
              }
              if (!(target.name in updatedColors)) {
                const randomColor = getRandomColor();
                updatedColors[target.name] = randomColor;
              }
            }
            else {
              if (!(source.name in updatedColors)) {
                updatedColors[source.name] = randomColor;
              }
              if (!(target.name in updatedColors)) {
                updatedColors[target.name] = randomColor;
              }
            }
          });


          saveDataToRelationshipData({ inheritanceWithAbstract });
          // Store the parent class names
          if (inheritanceWithAbstract.length > 0) {
            for (const relationship of inheritanceWithAbstract) {
              const parentName = relationship.target;
              if (!parentClassNames.includes(parentName)) {
                parentClassNames.push(parentName);
              }
            }
          }


          console.log("PARENT CLASS", parentClassNames)
          console.log("UPDATED COLORS: ", updatedColors);

          function getRandomColor() {
            const letters = '89ABCDEF';
            let color = '#';

            do {
              color = '#'; // Reset color
              for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * letters.length)];
              }
            } while (!isLightColor(color));

            return color;
          }

          // Function to check if a color is light
          function isLightColor(color) {
            const hex = color.replace('#', '');
            const rgb = parseInt(hex, 16); // Convert hex to decimal
            const r = (rgb >> 16) & 0xff; // Extract red component
            const g = (rgb >> 8) & 0xff; // Extract green component
            const b = (rgb >> 0) & 0xff; // Extract blue component

            // Calculate luminance (perceived brightness)
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

            return luminance > 0.5; // Return true if the color is light
          }




          setRelationshipColors(updatedColors);

          if (Array.isArray(level.classes) && level.classes.length > 0) {
            // Transform the classes data into elements
            const elementsArray = level.classes.flatMap((classItem, index) => {
              // const x = index * 200; // Adjust x position as needed
              // const y = index * 50; // Adjust y position as needed
              const isParent = parentClassNames.includes(classItem.name);
              console.log("PARENT IN FUNCC:", isParent, classItem.name);
              console.log("METHODS:", classItem.methods)
              let longestMethodName = "";
              classItem.methods.forEach(method => {
                if (method.name.length > longestMethodName.length) {
                  longestMethodName = method.name;
                }
              });

              console.log("Longest method name:", longestMethodName);
              let x, y;
              if (isParent) {
                // Set x and y for parent classes
                x = (index) + 450 + index * (280);
                y = (index) * 50;
              } else {
                // Set x and y for child classes
                const gap = longestMethodName.length * index * index * index;
                x = (index) + index * 250 + gap;
                y = (index) + index + 1 * (450); // Adjust the y position as needed
              }

              // let x, y;
              // if (isParent) {
              //   // Set x and y for parent classes
              //   x = (index) + 200 + index * (280);
              //   y = (index) * 50;
              // } else {
              //   // Set x and y for child classes
              //   const gap = longestMethodName.length * 10; // Adjust spacing based on the length of the longest method name
              //   x = (index + 1) * gap; // Adjust the multiplication factor as needed
              //   y = (index + 1) * 50; // Adjust the y position as needed
              // }

              return {
                id: `${classItem.name}`,
                data: {
                  name: classItem.name,
                  attributes: classItem.attributes || [],
                  methods: classItem.methods || [],
                },
                // position: { x, y },
                position: { x, y },
                type: 'custom',
                sourcePosition: 'right',
                targetPosition: 'left',
                className: classItem.name,

              }
            });


            //methodOverriding relationships
            methodOverridingRelationships = level.relationships
              .filter((relationship) =>
                relationship.type === "method overriding"
              )
              .map((relationship) => ({
                source: {
                  type: relationship.source.type,
                  name: relationship.source.name,
                },
                target: {
                  type: relationship.target.type,
                  name: relationship.target.name,
                },
              }));
            methodOverridingRelationships = level.relationships
              .filter((relationship) =>
                relationship.type === "method overriding"
              )
              .map((relationship) => ({
                source: {
                  type: relationship.source.type,
                  name: relationship.source.name,
                },
                target: {
                  type: relationship.target.type,
                  name: relationship.target.name,
                },
              }));

            methodOverloadingRelationships = level.relationships
              .filter((relationship) =>
                relationship.type === "method overloading"
              )
              .map((relationship) => ({
                source: {
                  type: relationship.source.type,
                  name: relationship.source.name,
                },
                target: {
                  type: relationship.target.type,
                  name: relationship.target.name,
                },
              }));

            console.log(methodOverloadingRelationships);

            setElements(elementsArray);
            console.log("ELEMENT:", elementsArray);

          } else {
            console.error('No classes found for tutorial.');
          }
        }

      } catch (error) {
        console.error('Error fetching class names:', error);
      }

    };

    fetchData();
  }, [projId, tutId, proj]);




  useEffect(() => {
    // Update the nodes state when elements change
    if (elements) {
      setNodes(elements);
    }
    console.log("mmmm", elements);
  }, [elements, setNodes]); // Include setNodes in the dependency array

  const onConnect = useCallback(
    (params) => {
      console.log('onConnect called with params:', params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        elements={elements}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isAbstract={isSourceAbstract}
        onEdgeUpdate={onEdgeUpdate}
        onEdgeUpdateStart={onEdgeUpdateStart}
        onEdgeUpdateEnd={onEdgeUpdateEnd}
      >
        <Background />
        <Controls />
        <MiniMap />


      </ReactFlow>

    </div>

  );
};


export default AnimationDatabase;