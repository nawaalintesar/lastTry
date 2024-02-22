import { useMemo } from "react";
import styles from "./AbstractContainer.module.css";
import { tutorialColors, hoverColors } from "./tutorialColors"; // Import the tutorialColors file

const AbstractContainer = ({
  tutorial,
  conceptDescription,
  propLeft,
  propBackground,
  propLetterSpacing,
  propLineHeight,
  onTutContainerClick, // Ensure this prop is passed correctly
}) => {
  const interfaceTutStyle = useMemo(() => {
    return {
      left: propLeft,
    };
  }, [propLeft]);

  const rectangleDivStyle = useMemo(() => {
    const backgroundColor = tutorialColors[tutorial._id] || "linear-gradient(92.09deg, #aeb2c0 36.98%, #827e9b)";
    //const hoverColor = hoverColors[tutorial._id] || "rgba(204, 47, 57, 0.7";

    return {
      background: backgroundColor,
      // filter: `drop-shadow(0 4px 4px ${hoverColor})`,
      // animation: "1s ease 0s infinite normal none shadow-drop-bottom",
      // opacity: 1,
    };
  });

  const hoverStyle = useMemo(() => {
    const hoverColor = hoverColors[tutorial._id] || "rgba(68, 47, 204, 0.7)";
    console.log("COLOUR",tutorial._id,tutorial.tutName,hoverColor);
    return {
      "--hover-color": hoverColor, // Set the hover color as a CSS variable
    };
  }, [tutorial._id]);



  const interfacesDefineAStyle = useMemo(() => {
    return {
      letterSpacing: propLetterSpacing,
      lineHeight: propLineHeight,
    };
  }, [propLetterSpacing="0.01em", propLineHeight="100%"]);

  return (
    <div
      className={styles.interfacetut}
      onClick={onTutContainerClick} 
      style={{ ...interfaceTutStyle, ...hoverStyle }}
    >
      <div className={styles.interfacetutChild} />
      <div className={styles.interfacetutItem} style={rectangleDivStyle} />
      <div className={styles.interfacesDefineA} style={interfacesDefineAStyle}>
        {tutorial.tutDescription.split('.')[0]}
      </div>
      <div className={styles.interfaces}>{conceptDescription}</div>
    </div>
  );
};

export default AbstractContainer;
