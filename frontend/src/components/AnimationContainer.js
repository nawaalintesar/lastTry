import { useState, useEffect, dispatch } from "react";
import TutorialStep from "./TutorialStep";
import styles from "./AnimationContainer.module.css";
import { useProjectsContext } from "../hooks/useProjectsContext.js";
import { useTutorialsContext } from "../context/TutorialsContext";
import AnimationDatabase from "./AnimationDatabase.js";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCodeFilesContext } from "../hooks/useCodeFilesContext";

const AnimationContainer = ({
  AnimationContainer,
  project,
  tutorial,
  levelClicked,
  language,
  undoButton,
}) => {
  const { isObjectifyingProject } = useProjectsContext();
  const { isObjectifyingTutorial } = useTutorialsContext();
  const user = useAuthContext();
  const [codeState, setcodeState] = useState(null);
  const [currentConceptState, setCurrentConceptState] = useState(0);
  const [currentInstanceState, setCurrentInstanceState] = useState(0);
  const [currentClassState, setCurrentClassState] = useState(0);
  const [clickedLevel, setClickedLevel] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // Track the current step index
  const [isEditPlusClicked, setIsEditPlusClicked] = useState(false);
  const [isEditMinusClicked, setIsEditMinusClicked] = useState(false);
  const [generatedRecommendations, setGeneratedRecommendations] = useState(""); // this variable needs to be called into the green and red boxes
  const [currentRecommendation, setCurrentRecommendation] = useState(0); // this variable needs to be called into the green and red boxes

  const codeFiles = useCodeFilesContext();

  const handleEditPlusClick = () => {
    console.log("Button clicked");
    if (!isEditPlusClicked) {
      setIsEditMinusClicked(false);
      setIsEditPlusClicked(true);
      getRecommendations("add");
    } else {
      setIsEditPlusClicked(false);
    }
    console.log("isEditPlusClicked after click:", isEditPlusClicked); // Log the state after click
  };

  const handleEditMinusClick = () => {
    console.log("Button clicked");
    if (!isEditMinusClicked) {
      setIsEditPlusClicked(false);
      setIsEditMinusClicked(true);
      getRecommendations("remove");
    } else {
      setIsEditMinusClicked(false);
    }
    console.log("isEditMinusClicked after click:", isEditMinusClicked); // Log the state after click
  };
  useEffect(() => {
    console.log("Updated isEditPlusClicked value:", isEditPlusClicked);
  }, [isEditPlusClicked, isEditMinusClicked]); // Pass isEditPlusClicked as a dependency

  const getRecommendations = async (change) => {
    try {
      const source = codeState?.classes
        ?.map((classObj) => classObj.name)
        .join(", ");
      // if theres no token message.alert("Create an account to try our AI features")
      const code = codeState?.codeData?.reduce((acc, curr) => {
        // Join the code array into a single string and append to accumulator
        return acc + curr.code.join("\n") + "\n";
      }, "");

      const response = await fetch("/api/projects/getRecommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.user.token}`,
        },
        body: JSON.stringify({
          currentCode: code,
          sourceComponent: source,
          typeOfChange: change,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      const data = await response.json();
      const parsedRecommendations = parseRecommendationString(data);
      console.log("HERE THEY ARE", parsedRecommendations);
      setGeneratedRecommendations(parsedRecommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error.message);
    }
  };

  const generateCode = async (rec) => {
    try {
      const code = codeState?.codeData;
      console.log("just checkin", code);

      const response = await fetch(
        `/api/projects/${project.project._id}/implementRecommendation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${user.user.token}`,
          },
          body: JSON.stringify({ currentCode: code, recommendation: rec }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
        
      }
      const data = await response.json();

      console.log("HERE THEY ARE", data);
    } catch (error) {
      console.error("Error fetching recommendations:", error.message);
    }
  };
  function parseRecommendationString(str) {
    // Split the string by newline characters
    const lines = str.split("\n");

    // Initialize an array to store parsed recommendations
    const recommendations = [];
    let currentRecommendation = "";

    // Iterate through each line
    lines.forEach((line) => {
      // Trim extra spaces and remove '*' from the beginning and end of the line
      line = line.trim().replace(/\*/g, "");

      // If the line is not empty
      if (line) {
        // If the line starts with a number
        if (/^\d/.test(line)) {
          // If there's a current recommendation being processed, push it to the array
          if (currentRecommendation) {
            recommendations.push(currentRecommendation);
          }
          // Create a new recommendation object
          const [recommendationNumber, item] = line
            .split(".")
            .map((part) => part.trim());
          currentRecommendation = {
            recommendationNumber: parseInt(recommendationNumber),            
            item,
            recommendation: "",
          };
        } else if (line.includes("Recommendation:")) {
          // If the line contains 'Recommendation:', treat everything after ':' as recommendation
          currentRecommendation.recommendation = line
            .split(":")
            .slice(1)
            .join(":")
            .trim();
        } else if (line.includes("Justification:")) {
          // If the line contains 'Justification:', treat everything after ':' as justification
          currentRecommendation.recommendation += line
            .split(":")
            .slice(1)
            .join(":")
            .trim();
        } else {
          currentRecommendation.recommendation += line.trim();
        }
      }
    });

    // Push the last recommendation to the array
    if (currentRecommendation) {
      recommendations.push(currentRecommendation);
    }

    return recommendations;
  }
  const updateProgressForTutorial = async (levelC, progLang) => {
    console.log("prog", progLang);
    const response = await fetch("api/tutorials/updateProgress", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.user.token}`,
      },
      body: JSON.stringify({
        userId: user.user.userID,
        tutorialId: tutorial._id,
        progLang: progLang,
        levelNumber: levelC,
      }),
    });
    return response;
  };

  useEffect(() => {
    console.log("AnimationContainer mounted");
    if (project) {
      // console.log("Projects in anim", project?.project?.codeStates);
      setcodeState(
        project?.project?.codeStates?.[project.project.codeStates.length - 1] ||
          "----"
      );
      console.log(codeState, "HELLO");
    } else if (tutorial) {
      const levelClickedNumber = parseInt(levelClicked, 10);
      const filteredLevels = tutorial.level.filter(
        (level) => level.progLang === language
      );
      const currentClickedLevel = filteredLevels[levelClickedNumber - 1];
      setClickedLevel(currentClickedLevel);
      // console.log('Tuts in anim', (currentClickedLevel.code || []).join('\n'))
      // console.log("asdfasdfsadfadsfasd", currentClickedLevel.tutorialSteps)
      console.log("TUTORIAL AND LEVE", tutorial, currentClickedLevel);
    }
  }, [
    project,
    tutorial,
    levelClicked,
    language,
    currentStepIndex,
    isObjectifyingTutorial,
  ]);

  const saveCodeChanges = async () => {
    //get codeFilez changes and save the lines inside the proj database
    console.log("State is", codeFiles.state);
    const newCodeData = Object.keys(codeFiles?.state?.codeFiles).map(
      (fileKey, index) => {
        console.log("File:", codeFiles?.state?.codeFiles[fileKey].fileName);
        return {
          fileName: codeFiles?.state?.codeFiles[fileKey].fileName,
          code: codeFiles?.state?.codeFiles[fileKey].code,
        };
      }
    );
    console.log("ARE U DATA", newCodeData);
    const fetchUpdatedResponse = await fetch(
      `/api/projects/${project?.project?._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.user.token}`,
        },
        body: JSON.stringify({ codeData: newCodeData }),
      }
    );
  };

  const getOOPConceptGroups = () => {
    const concepts = codeState?.relationships || [];

    // Group concepts by type
    const groupedConcepts = concepts.reduce((groups, concept) => {
      const key = concept.type;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(concept);
      return groups;
    }, {});

    // Organize groups by type and sort them
    const organizedGroups = Object.values(groupedConcepts).sort(
      (groupA, groupB) => {
        const nameA = groupA[0]?.type || "";
        const nameB = groupB[0]?.type || "";
        return nameA.localeCompare(nameB);
      }
    );

    return organizedGroups;
  };

  const organizedOOPConcepts = getOOPConceptGroups();
  const currentOOPConceptGroup =
    organizedOOPConcepts[currentConceptState - 1] || [];

  // console.log("OOP Concept Groups:", organizedOOPConcepts);

  const handleNextBig = (number) => {
    if (number === 1 && currentConceptState < organizedOOPConcepts.length) {
      setCurrentConceptState(currentConceptState + 1);
    }
  };

  const handlePrevBig = (number) => {
    if (number === 1 && currentConceptState > 0) {
      setCurrentConceptState(currentConceptState - 1);
    }
  };

  const handleNext = (number) => {
    if (tutorial && currentStepIndex < clickedLevel.noTutSteps - 1) {
      console.log("plss", clickedLevel.noTutSteps);
      setCurrentStepIndex(currentStepIndex + 1);
      updateProgressForTutorial(
        clickedLevel.levelNumber,
        clickedLevel.progLang
      );
    } else if (project) {
      if (number === 1) {
        if (currentClassState < generatedSummaries.length - 1) {
          // Move to the next class instance
          setCurrentClassState(currentClassState + 1);
        } else {
          const nextInstanceIndex = currentInstanceState + 1;
          if (nextInstanceIndex < currentOOPConceptGroup.length) {
            setCurrentInstanceState(nextInstanceIndex);
          } else {
            // Reset instance index when reaching the end
            setCurrentInstanceState(0);
            // Move to the next concept if available
            const nextConceptIndex = currentConceptState + 1;
            if (nextConceptIndex < organizedOOPConcepts.length + 1) {
              setCurrentConceptState(nextConceptIndex);
            } else {
              // If there is only one instance in the last concept, move to the next concept
              setCurrentConceptState(0);
            }
          }
        }
      }
      else if (
        number !== 1 &&
        currentRecommendation < generatedRecommendations.length-1
      ) {
        setCurrentRecommendation(currentRecommendation + 1);
      }
    } 
  };

  const handlePrev = (number) => {
    if (tutorial && currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else if (project) {
      if (number === 1) {
        if (currentClassState > 0) {
          // Move to the previous class instance
          setCurrentClassState(currentClassState - 1);
        } else {
          const prevInstanceIndex = currentInstanceState - 1;
          if (prevInstanceIndex >= 0) {
            // Move to the previous instance
            setCurrentInstanceState(prevInstanceIndex);
          } else {
            // Move to the previous concept if available
            const prevConceptIndex = currentConceptState - 1;
            if (prevConceptIndex >= 0) {
              setCurrentConceptState(prevConceptIndex);
            }
          }
        }
      } else if (
        number !== 1 &&
        currentRecommendation < generatedRecommendations.length
      ) {
        setCurrentRecommendation(currentRecommendation - 1);
      }
    }
  };

  const generateClassSummaries = (classes, abstractClasses) => {
    const summaries = [];

    // Generate class summaries
    classes.forEach((classInfo) => {
      if (classInfo.isClass && !abstractClasses.includes(classInfo.name)) {
        let classDescription = `${classInfo.name} is a blueprint for creating objects.`;

        // Attributes
        if (classInfo.attributes && classInfo.attributes.length > 0) {
          const attributesDescription = ` Each object created from this class will have are ${classInfo.attributes
            .map((attribute) => attribute.name)
            .join(", ")}`;
          classDescription += attributesDescription;
        }

        // Methods
        if (classInfo.methods && classInfo.methods.length > 0) {
          const methodsDescription = ` and functions that describe what those objects can do, like ${classInfo.methods
            .map((method) => method.name)
            .join(", ")}`;
          classDescription += methodsDescription;
        }
        classDescription += ".";

        summaries.push(classDescription);
      }
    });

    return summaries;
  };

  const generateOOPSummaries = (relationships) => {
    const oopsummaries = [];
    // Relationship descriptions
    relationships.forEach((relationship) => {
      let description;

      switch (relationship.type) {
        case "polymorphism":
          const sourceName = relationship.source.name?.split(".")[0];
          const targetName =
            relationship.target.name?.split(".")[0] || "another class";
          description = `Objects of different classes (such as ${targetName}, and ${sourceName}) are treated as variant forms of ${sourceName} since it is the parent, enabling code to operate on them uniformly despite their differing specific implementations.`;
          break;

        case "method overriding":
          const sourceNameOverride = relationship.source.name;
          const targetNameOverride = relationship.target.name;
          description = `${targetNameOverride} provides its own version of a method that is already defined in ${sourceNameOverride}, customizing its behavior.`;
          break;

        case "method overloading":
          const sourceNameOverload = relationship.source.name;
          const functionName = relationship.target.name;
          description = `${sourceNameOverload} defines multiple methods with the same name- ${functionName} but different parameters, providing flexibility in how it can be used.`;
          break;

        case "inheritance":
          const sourceNameInheritance = relationship.source.name;
          const targetNameInheritance = relationship.target.name;
          description = `${sourceNameInheritance} inherits features from ${targetNameInheritance}, allowing it to reuse and extend functionality from an existing class.`;
          break;

        case "encapsulation":
          const sourceNameEncapsulation = relationship.source.name;
          description = `${sourceNameEncapsulation} hides the implementation details of its attributes and methods, protecting them from direct access and modification.`;
          break;

        case "abstract class":
          const sourceNameAbstract = relationship.source.name;
          description = `${sourceNameAbstract} is a blueprint for other classes. It may have abstract methods that must be implemented by its subclasses.`;
          break;

        case "interface":
          const interfaceName = relationship.target.name;
          const className = relationship.source.name;
          description = `The ${interfaceName} interface defines certain standardized behaviors, and the ${className} class implements these behaviors rather than redefining it on its own.`;
          break;
        default:
          description = "No explanation necessary :)";
      }

      oopsummaries.push(description);
    });

    return oopsummaries;
  };
  // Populate abstractClasses array
  const abstractClasses = [];
  codeState?.relationships?.forEach((relationship) => {
    if (relationship.type === "abstract class") {
      abstractClasses.push(relationship.source.name);
    }
  });

  const generatedSummaries = generateClassSummaries(
    codeState?.classes || [],
    abstractClasses
  );
  const generatedOOPSummaries = generateOOPSummaries(currentOOPConceptGroup);

  const handleUndoClick = () => {
    // Set the state to true when the undo button is clicked
    undoButton(true);
    console.log(undoButton);
    // Perform any additional actions you need for undo here
  };
  console.log("currentOOPConceptGroup", currentOOPConceptGroup);

  // console.log("current", currentClassState, currentConceptState, currentInstanceState, currentOOPConceptGroup)

  return (
    <>
      <div
        className={`${styles.defaultAnimationContainer} ${AnimationContainer}`}
      >
        <div className={styles.frame}>
          <div className={styles.animation}>
            {tutorial && clickedLevel ? (
              <TutorialStep
                oopConceptTitles={`Step ${currentStepIndex + 1}`}
                conceptTitle="/vector.svg"
                conceptDescription="/vector.svg"
                conceptCode=""
                conceptCodeImageUrls=""
                carMake={
                  clickedLevel?.tutorialSteps[currentStepIndex]?.substring(
                    clickedLevel.tutorialSteps[currentStepIndex].indexOf(":") +
                      1
                  ) || "tutorial step not found"
                }
                conceptCodeDimensions={`${currentStepIndex + 1 || 1}/${
                  clickedLevel.noTutSteps
                }`}
                propTop="66px"
                propLeft="15px"
                propRight="51.74%"
                propLeft1="46.86%"
                propRight1="48.66%"
                propLeft2="49.95%"
                onNext={handleNext} // Pass the next step handler
                onPrev={handlePrev} // Pass the previous step handler
                
              />
            ) : (
              <>
                {/* Render classes */}
                {generatedSummaries.length > 0 && (
                  <TutorialStep
                    oopConceptTitles={`Identified OOP Concept - Classes ${
                      currentConceptState + 1
                    }/${organizedOOPConcepts.length + 1 || 1}`}
                    conceptTitle="/vector.svg"
                    conceptDescription="/vector.svg"
                    conceptCode="/vector.svg"
                    conceptCodeImageUrls="/vector.svg"
                    carMake={`${
                      generatedSummaries[currentClassState] || "N/A"
                    }`}
                    conceptCodeDimensions={`${currentClassState + 1}/${
                      generatedSummaries.length || 1
                    }`}
                    propTop="66px"
                    propLeft="15px"
                    propRight="51.74%"
                    propLeft1="46.86%"
                    propRight1="48.66%"
                    propLeft2="49.95%"
                    onNext={() => handleNext(1)}
                    onPrev={() => handlePrev(1)}
                    onNextBig={() => handleNextBig(1)}
                    onPrevBig={() => handlePrevBig(1)}
                    // style={{ backgroundColor: 'green' }}
                  />
                )}

                {/* Render other OOP concepts */}
                {currentConceptState >= 0 && currentOOPConceptGroup.length > 0 && (
                  <TutorialStep
                    oopConceptTitles={`Identified OOP Concept - ${
                      currentOOPConceptGroup[0]?.type || "N/A"
                    } ${currentConceptState + 1}/${
                      organizedOOPConcepts.length + 1
                    }`}
                    conceptTitle="/vector.svg"
                    conceptDescription="/vector.svg"
                    conceptCode="/vector.svg"
                    conceptCodeImageUrls="/vector.svg"
                    carMake={`${
                      generatedOOPSummaries[currentInstanceState] || "N/A"
                    }`}
                    conceptCodeDimensions={`${currentInstanceState + 1}/${
                      currentOOPConceptGroup.length || 1
                    }`}
                    propTop="66px"
                    propLeft="15px"
                    propRight="51.74%"
                    propLeft1="46.86%"
                    propRight1="48.66%"
                    propLeft2="49.95%"
                    onNext={() => handleNext(1)}
                    onPrev={() => handlePrev(1)}
                    onNextBig={() => handleNextBig(1)}
                    onPrevBig={() => handlePrevBig(1)}
                    // style={{ backgroundColor: 'green' }}
                  />
                )}

                {isEditPlusClicked && (
                  <TutorialStep
                    oopConceptTitles={`Recommended Addition - ${
                      generatedRecommendations[currentRecommendation]?.item ||
                      "N/A"
                    }`}
                    conceptTitle="/vector.svg"
                    conceptDescription="/vector.svg"
                    carMake={`${
                      generatedRecommendations[currentRecommendation]
                        ?.recommendation || "N/A"
                    }`}
                    conceptCodeDimensions={` ${currentRecommendation + 1}/${
                      generatedRecommendations.length
                    }`}
                    propTop="66px"
                    propLeft="15px"
                    propRight="51.74%"
                    propLeft1="46.86%"
                    propRight1="48.66%"
                    propLeft2="49.95%"
                    onNext={() => handleNext(2)}
                    onPrev={() => handlePrev(2)}
                    isEditPlusClicked={isEditPlusClicked}
                    onImplement={()=> generateCode(generatedRecommendations[currentRecommendation]?.recommendation)}
                    background="#D7EADA"
                  />
                )}

                {isEditMinusClicked && (
                  <TutorialStep
                  oopConceptTitles={`Recommended Deletion - ${
                    generatedRecommendations[currentRecommendation]?.item ||
                    "N/A"
                  } `}
                  conceptTitle="/vector.svg"
                  conceptDescription="/vector.svg"
                  carMake={`${
                    generatedRecommendations[currentRecommendation]
                      ?.recommendation || "N/A"
                  }`}
                  conceptCodeDimensions={`${currentRecommendation + 1}/${
                    generatedRecommendations.length
                  }`}
                  propTop="66px"
                  propLeft="15px"
                  propRight="51.74%"
                  propLeft1="46.86%"
                  propRight1="48.66%"
                  propLeft2="49.95%"
                  onNext={() => handleNext(2)}
                  onPrev={() => handlePrev(2)}
                  isEditMinusClicked={isEditMinusClicked}
                  onImplement={()=> generateCode(generatedRecommendations[currentRecommendation]?.recommendation)}
                  background="#e5d2d2"
                  />
                )}
              </>
            )}
          </div>
          <div className={styles.arrowContainer}>
            {tutorial ? (
              <>
                {isObjectifyingTutorial && (
                  <AnimationDatabase
                    tutId={tutorial._id}
                    level={clickedLevel}
                  />
                )}
              </>
            ) : (
              <>
                {isObjectifyingProject && (
                  <AnimationDatabase
                    projId={project.project._id}
                    proj={project}
                  />
                )}
              </>
            )}
          </div>
        </div>

        <div className={styles.frame1}>
          <div className={styles.topBarAnimation}>
            <div className={styles.animation1}>
              <div className={styles.icon}>
                <img className={styles.vectorIcon} alt="" />
                <img
                  className={styles.vectorIcon1}
                  alt=""
                  src="/vector5@2x.png"
                />
                <b className={styles.js}>AG</b>
              </div>
              <div className={styles.animation2}>Animation</div>
            </div>

            <div className={styles.saveButton}>
              <div className={styles.ellipseParent} >
                <div className={`${styles.frameChild} ${tutorial ? styles.disabled : ''}`} onClick={handleEditPlusClick}>
                  <img
                    className={styles.editPlus}
                    alt=""
                    src="/edit--plus.svg"
                  />
                </div>
              </div>

              <div
                className={styles.frameParent}
                onClick={handleEditMinusClick}
              >
                <div className={styles.ellipseWrapper}>
                  <div className={`${styles.frameItem} ${tutorial ? styles.disabled : ''}`}>
                    <img
                      className={styles.editMinus}
                      alt=""
                      src="/edit--minus.svg"
                    />
                  </div>
                </div>
              </div>

              <button
                className={`${styles.explorebutton} ${
                  tutorial ? styles.disabled : ""
                }`}
                disabled={tutorial}
                onClick={() => {
                  handleUndoClick(); // Call the handler for undo button click
                }}
              >
                <div className={styles.undo}>Undo</div>
                <img
                  className={styles.undoButtonIcon}
                  alt=""
                  src="/undo-button.svg"
                />
              </button>
              <button
                className={`${styles.explorebutton1} ${
                  tutorial ? styles.disabled : ""
                }`}
                onClick={() => saveCodeChanges()}
                disabled={tutorial}
              >
                <div className={styles.undo}>Save</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimationContainer;
