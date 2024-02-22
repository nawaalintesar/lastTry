import { useMemo } from "react";
import styles from "./HeaderLight.module.css";

const HeaderLight = ({
  headerLightHeight,
  headerLightMaxHeight,
  headerLightPosition,
  headerLightTop,
  headerLightLeft,
  headerLightMaxWidth,
  headerLightJustifyContent,
  frameDivAlignContent,
  frameDivMaxWidth,
  buttonCursor,
  headerLightRight,
  frameDivWidth,
  frameDivLeft,
  frameDivAlignItems,
  onButtonContainerClick,
  onButtonClick,
  onVoopClick,
}) => {
  const headerLightStyle = useMemo(() => {
    return {
      height: headerLightHeight,
      maxHeight: headerLightMaxHeight,
      position: headerLightPosition,
      top: headerLightTop,
      left: headerLightLeft,
      maxWidth: headerLightMaxWidth,
      justifyContent: headerLightJustifyContent,
      right: headerLightRight,
    };
  }, [
    headerLightHeight,
    headerLightMaxHeight,
    headerLightPosition,
    headerLightTop,
    headerLightLeft,
    headerLightMaxWidth,
    headerLightJustifyContent,
    headerLightRight,
  ]);

  const frameDivStyle = useMemo(() => {
    return {
      alignContent: frameDivAlignContent,
      maxWidth: frameDivMaxWidth,
      width: frameDivWidth,
      left: frameDivLeft,
      alignItems: frameDivAlignItems,
    };
  }, [
    frameDivAlignContent,
    frameDivMaxWidth="100%",
    frameDivWidth="100%",
    frameDivLeft="calc(50% - 679px)",
    frameDivAlignItems,
  ]);

  const buttonStyle = useMemo(() => {
    return {
      cursor: buttonCursor,
    };
  }, [buttonCursor]);

  return (
    <div className={styles.headerLight} style={headerLightStyle}>
      <div className={styles.buttonParent} style={frameDivStyle}>
        <div
          className={styles.button}
          style={buttonStyle}
          onClick={onButtonContainerClick}
        >
          <div className={styles.codeEditor}>Code Editor</div>
        </div>
        <div className={styles.voOp}>
          <span className={styles.voOpTxtContainer}  onClick={onVoopClick}>
            <p className={styles.vo}>VO</p>
            <p className={styles.vo}>&nbsp;</p>
            <p className={styles.vo}>&nbsp;</p>
            <p className={styles.op}>OP</p>
          </span>
        </div>
        <button
          className={styles.button1}
          id="LogOutButton"
          onClick={onButtonClick}
        >
          <div className={styles.text}>Sign In</div>
        </button>
      </div>
    </div>
  );
};

export default HeaderLight;
