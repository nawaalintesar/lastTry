import { useMemo } from "react";
import styles from "./Footer.module.css";

const Footer = ({
  footerHeight,
  footerMaxWidth,
  footerPosition,
  footerTop,
  footerLeft,
  footerMaxHeight,
  footerJustifyContent,
}) => {
  const footerStyle = useMemo(() => {
    return {
      height: footerHeight,
      maxWidth: footerMaxWidth,
      position: footerPosition,
      top: footerTop,
      left: footerLeft,
      maxHeight: footerMaxHeight,
      justifyContent: footerJustifyContent,
    };
  }, [
    footerHeight="133px",
    footerMaxWidth="unset",
    footerPosition="absolute",
    footerTop="942px",
    footerLeft="0px",
    footerMaxHeight="100%",
    footerJustifyContent="stretch",
  ]);

  return (
    <div className={styles.footer} style={footerStyle}>
      <div className={styles.voopSeeMoreContainer}>
        <p className={styles.voop}>Voop</p>
        <p className={styles.blankLine}>&nbsp;</p>
        <p className={styles.seeMoreLearn}>{`See More, Learn More. `}</p>
      </div>
    </div>
  );
};

export default Footer;
