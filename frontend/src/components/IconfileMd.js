import { useMemo } from "react";
import styles from "./IconfileMd.module.css";

const IconfileMd = ({
  imageCode,
  dimensionCode,
  technologyCode,
  iconfileMdPosition,
  iconfileMdWidth,
  iconfileMdHeight,
  vectorIconHeight,
  vectorIconWidth,
  vectorIconTop,
  vectorIconRight,
  vectorIconBottom,
  vectorIconLeft,
  mDColor,
  mDTop,
}) => {
  const iconfileMdStyle = useMemo(() => {
    return {
      position: iconfileMdPosition,
      width: iconfileMdWidth,
      height: iconfileMdHeight,
    };
  }, [iconfileMdPosition, iconfileMdWidth, iconfileMdHeight]);

  const vectorIconStyle = useMemo(() => {
    return {
      height: vectorIconHeight,
      width: vectorIconWidth,
      top: vectorIconTop,
      right: vectorIconRight,
      bottom: vectorIconBottom,
      left: vectorIconLeft,
    };
  }, [
    vectorIconHeight,
    vectorIconWidth,
    vectorIconTop,
    vectorIconRight,
    vectorIconBottom,
    vectorIconLeft,
  ]);

  const mDStyle = useMemo(() => {
    return {
      color: mDColor,
      top: mDTop,
    };
  }, [mDColor, mDTop]);

  return (
    <div className={styles.iconfileMd} style={iconfileMdStyle}>
      <img className={styles.vectorIcon} alt="" src={imageCode} />
      <img
        className={styles.vectorIcon1}
        alt=""
        src={dimensionCode}
        style={vectorIconStyle}
      />
      <b className={styles.md} style={mDStyle}>
        {technologyCode}
      </b>
    </div>
  );
};

export default IconfileMd;
