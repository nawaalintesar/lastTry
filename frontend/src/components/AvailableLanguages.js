// AvailableLanguages.js

import styles from "./TutorialForm.module.css";
import { useMemo } from "react";

const AvailableLanguages = ({ language, propLeft }) => {
  const interfaceTutStyle = useMemo(() => {
    return {
      left: propLeft,
    };
  }, [propLeft]);

  return (
    <div className={styles.rectangleGroup} style={interfaceTutStyle}>
      <div className={styles.frameChild} />
      <div className={styles.c}>{language}</div>
    </div>
  );
};

export default AvailableLanguages;
