import { useState, useMemo, useCallback } from "react";
import LogOutPopOutL from "./LogOutPopOutL";
import PortalPopup from "./PortalPopup";
import styles from "./Property1Default.module.css";

const Property1Default = ({
  buttonHeaderText,
  property1DefaultAlignContent,
  property1DefaultJustifyContent,
  property1DefaultPosition,
  property1DefaultTop,
  property1DefaultLeft,
  property1DefaultOverflow,
  property1DefaultHeight,
  frameDivHeight,
  frameDivTop,
  frameDivBottom,
  textCursor,
  onFrameButtonClick,
  onVoopClick,
}) => {
  const [isLogOutPopOutLPopupOpen, setLogOutPopOutLPopupOpen] = useState(false);
  const property1Default1Style = useMemo(() => {
    return {
      alignContent: property1DefaultAlignContent,
      justifyContent: property1DefaultJustifyContent,
      position: property1DefaultPosition,
      top: property1DefaultTop,
      left: property1DefaultLeft,
      overflow: property1DefaultOverflow,
      height: property1DefaultHeight,
    };
  }, [
    buttonHeaderText="codeEditorButtonHeader",
        property1DefaultAlignContent="stretch",
        property1DefaultJustifyContent="unset",
        property1DefaultPosition="fixed",
        property1DefaultTop="0px",
        property1DefaultLeft="62px",
        property1DefaultOverflow="hidden",
        property1DefaultHeight="81px",
        frameDivHeight="45.68%",
        frameDivTop="27.16%",
        frameDivBottom="27.16%",
        textCursor="pointer",
        //onFrameButtonClick={onFrameButtonClick},
  ]);

  const frameDivStyle = useMemo(() => {
    return {
      height: frameDivHeight,
      top: frameDivTop,
      bottom: frameDivBottom,
    };
  }, [frameDivHeight, frameDivTop, frameDivBottom]);

  const textStyle = useMemo(() => {
    return {
      cursor: textCursor,
    };
  }, [textCursor]);

  const openLogOutPopOutLPopup = useCallback(() => {
    setLogOutPopOutLPopupOpen(true);
  }, []);

  const closeLogOutPopOutLPopup = useCallback(() => {
    setLogOutPopOutLPopupOpen(false);
  }, []);

  return (
    <>
      <div className={styles.property1default} style={property1Default1Style}>
        <div className={styles.frameParent} style={frameDivStyle}>

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
            id="LogOutButton"
            onClick={openLogOutPopOutLPopup}
          >
            <div className={styles.text} style={textStyle}>
              Log Out
            </div>
          </button>
        </div>
      </div>
      {isLogOutPopOutLPopupOpen && (
        <PortalPopup
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Centered"
          onOutsideClick={closeLogOutPopOutLPopup}
        >
          <LogOutPopOutL onClose={closeLogOutPopOutLPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default Property1Default;
