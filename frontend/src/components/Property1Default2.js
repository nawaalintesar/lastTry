import { useState, useMemo, useCallback } from "react";
import LogOutPopOutL from "./LogOutPopOutL";
import PortalPopup from "./PortalPopup";
import styles from "./Property1Default2.module.css";

const Property1Default2 = ({
  buttonText,
  actionButtonText,
  property1DefaultAlignContent,
  property1DefaultJustifyContent,
  property1DefaultPosition,
  property1DefaultTop,
  property1DefaultLeft,
  buttonPadding,
  buttonOverflow,
  textDisplay,
  textWidth,
  textFlexShrink,
  textCursor,
  onFrameButtonClick,
  onFrameButtonClickSignIn,
  onVoopClick,
}) => {
  //const [isLogOutPopOutLPopupOpen, setLogOutPopOutLPopupOpen] = useState(false);
  const property1Default1Style = useMemo(() => {
    return {
      alignContent: property1DefaultAlignContent,
      justifyContent: property1DefaultJustifyContent,
      position: property1DefaultPosition,
      top: property1DefaultTop,
      left: property1DefaultLeft,
    };
  }, [
    property1DefaultAlignContent,
    property1DefaultJustifyContent,
    property1DefaultPosition,
    property1DefaultTop,
    property1DefaultLeft,
  ]);

  const buttonStyle = useMemo(() => {
    return {
      padding: buttonPadding,
      overflow: buttonOverflow,
    };
  }, [buttonPadding, buttonOverflow]);

  const textStyle = useMemo(() => {
    return {
      display: textDisplay,
      width: textWidth,
      flexShrink: textFlexShrink,
      cursor: textCursor,
    };
  }, [textDisplay, textWidth, textFlexShrink, textCursor]);

  // const openLogOutPopOutLPopup = useCallback(() => {
  //   setLogOutPopOutLPopupOpen(true);
  // }, []);

  // const closeLogOutPopOutLPopup = useCallback(() => {
  //   setLogOutPopOutLPopupOpen(false);
  // }, []);

  return (
    <>
      <div className={styles.property1default} style={property1Default1Style}>
        <div className={styles.frameParent}>
          <button className={styles.buttonWrapper} onClick={onFrameButtonClick}>
            <div className={styles.button}>
              <div className={styles.codeEditor}>Code Editor</div>
            </div>
          </button>
          <div className={styles.voOp} onClick={onVoopClick}>
            <span className={styles.voOpTxtContainer}>
              <p className={styles.vo}>VO</p>
              <p className={styles.vo}>&nbsp;</p>
              <p className={styles.vo}>&nbsp;</p>
              <p className={styles.op}>OP</p>
            </span>
          </div>
          <button
            className={styles.button1}
            id="SignINButton"
            onClick={onFrameButtonClickSignIn}
            style={buttonStyle}
          >
            <div className={styles.text} style={textStyle}>
              {actionButtonText}
            </div>
          </button>
        </div>
      </div>
      {/* {isLogOutPopOutLPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeLogOutPopOutLPopup}
        >
          <LogOutPopOutL onClose={closeLogOutPopOutLPopup} />
        </PortalPopup>
      )} */}
    </>
  );
};

export default Property1Default2;
