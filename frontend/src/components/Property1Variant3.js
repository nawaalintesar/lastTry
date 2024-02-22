import { useMemo } from "react";
import styles from "./Property1Variant3.module.css";

const Property1Variant3 = ({
  showRectangleDiv,
  property1Variant3Width,
  property1Variant3Position,
  property1Variant3Top,
  property1Variant3Left,
  rectangleDivHeight,
  rectangleDivBottom,
  rectangleDivBackgroundColor,
  rectangleDivHeight1,
  rectangleDivWidth,
  rectangleDivTop,
  rectangleDivBottom1,
  rectangleDivLeft,
  rectangleDivRight,
  rectangleDivHeight2,
  rectangleDivWidth1,
  rectangleDivTop1,
  rectangleDivBottom2,
  rectangleDivLeft1,
  rectangleDivBackgroundColor1,
  rectangleDivBorder,
  rectangleDivRight1,
}) => {
  const property1Variant3Style = useMemo(() => {
    return {
      width: property1Variant3Width,
      position: property1Variant3Position,
      top: property1Variant3Top,
      left: property1Variant3Left,
    };
  }, [
    property1Variant3Width,
    property1Variant3Position,
    property1Variant3Top,
    property1Variant3Left,
  ]);

  const rectangleDivStyle = useMemo(() => {
    return {
      height: rectangleDivHeight,
      bottom: rectangleDivBottom,
      backgroundColor: rectangleDivBackgroundColor,
    };
  }, [rectangleDivHeight, rectangleDivBottom, rectangleDivBackgroundColor]);

  const rectangleDiv1Style = useMemo(() => {
    return {
      height: rectangleDivHeight1,
      width: rectangleDivWidth,
      top: rectangleDivTop,
      bottom: rectangleDivBottom1,
      left: rectangleDivLeft,
      right: rectangleDivRight,
    };
  }, [
    rectangleDivHeight1,
    rectangleDivWidth,
    rectangleDivTop,
    rectangleDivBottom1,
    rectangleDivLeft,
    rectangleDivRight,
  ]);

  const rectangleDiv2Style = useMemo(() => {
    return {
      height: rectangleDivHeight2,
      width: rectangleDivWidth1,
      top: rectangleDivTop1,
      bottom: rectangleDivBottom2,
      left: rectangleDivLeft1,
      backgroundColor: rectangleDivBackgroundColor1,
      border: rectangleDivBorder,
      right: rectangleDivRight1,
    };
  }, [
    rectangleDivHeight2,
    rectangleDivWidth1,
    rectangleDivTop1,
    rectangleDivBottom2,
    rectangleDivLeft1,
    rectangleDivBackgroundColor1,
    rectangleDivBorder,
    rectangleDivRight1,
  ]);

  return (
    <div className={styles.property1variant3} style={property1Variant3Style}>
      <div className={styles.components}>
        <div className={styles.componentsChild} style={rectangleDivStyle} />
        <div className={styles.componentsItem} />
      </div>
      <div
        className={styles.property1variant3Child}
        style={rectangleDiv1Style}
      />
      {showRectangleDiv && (
        <div
          className={styles.property1variant3Item}
          style={rectangleDiv2Style}
        />
      )}
    </div>
  );
};

export default Property1Variant3;
