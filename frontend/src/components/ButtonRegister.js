import { useMemo } from "react";
import styles from "./ButtonRegister.module.css";

const Property1Default = ({
  property1DefaultPosition,
  property1DefaultTop,
  property1DefaultLeft,
  property1DefaultCursor,
  onLogInButtonClick,
}) => {
  const property1DefaultStyle = useMemo(() => {
    return {
      position: property1DefaultPosition,
      top: property1DefaultTop,
      left: property1DefaultLeft,
      cursor: property1DefaultCursor,
    };
  }, [
    property1DefaultPosition,
    property1DefaultTop,
    property1DefaultLeft,
    property1DefaultCursor,
  ]);

  return (
    <div
      className={styles.property1default}
      style={property1DefaultStyle}
      onClick={onLogInButtonClick}
    >
      <div className={styles.text}>Log in</div>
    </div>
  );
};

export default Property1Default;
