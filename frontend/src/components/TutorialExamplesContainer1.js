import TutorialExampleLevel3 from "./TutorialExampleLevel3";
import styles from "./TutorialExamplesContainer1.module.css";
import { useTutorialsContext } from "../hooks/useTutorialsContext.js";

const TutorialExamplesContainer1 = ({ tutorial }) => {
  const { tutorials, dispatch } = useTutorialsContext();

  // Assuming you get the selected programming language from somewhere (e.g., a state)
  const selectedLanguage = "Java"; // Replace with the actual selected language

  const filteredLevels = tutorial.level.filter((level) => level.progLang === selectedLanguage);
console.log(filteredLevels)
  return (
    <div className={styles.tutorialexamples}>
      <div className={styles.tutorialExamples}>Tutorial Examples</div>

      {filteredLevels.map((level, index) => (
        <TutorialExampleLevel3
          key={index}
          tutorial={tutorial}
          tutorialId={tutorial._id}
          lessonTitle={`Level ${level.levelNumber}`}
          lessonDescription={level.codeData[0].code[0]}
          property1DefaultWidth="100%"
          property1DefaultHeight="23.19%"
          property1DefaultPosition="absolute"
          property1DefaultTop={`${(index % 4) * 100}px`}
          property1DefaultRight="0%"
          property1DefaultBottom="54.82%"
          property1DefaultLeft="0%"
          levelClicked={`${level.levelNumber}`}
          // Add other properties as needed based on your data structure
          // ...
        />
      ))}
    </div>
  );
};

export default TutorialExamplesContainer1;
