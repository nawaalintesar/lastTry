import { useState, useMemo, useCallback } from "react";
import SideMenu from "./SideMenu";
import PortalDrawer from "./PortalDrawer";
import styles from "./Property1Closed.module.css";

const Property1Closed = ({
  dimensionCode,
  property1ClosedHeight,
  property1ClosedPosition,
  property1ClosedTop,
  property1ClosedLeft,
  onFrameContainerClick,
  onFrameIconClick,
  onUsericonContainerClick,
  onGroupClick,
  onDashoboardSMContainerClick,
}) => {
  const property1ClosedStyle = useMemo(() => {
    return {
      height: property1ClosedHeight,
      position: property1ClosedPosition,
      top: property1ClosedTop,
      left: property1ClosedLeft,
    };
  }, [
    dimensionCode="/layoutgrid4@2x.png",
        property1ClosedHeight="942px",
        property1ClosedPosition="absolute",
        property1ClosedTop="1px",
        property1ClosedLeft="0px",
        
  ]);

  const [isSideMenuOpen, setSideMenuOpen] = useState(false);

  const openSideMenu = useCallback(() => {
    setSideMenuOpen(true);
  }, []);

  const closeSideMenu = useCallback(() => {
    setSideMenuOpen(false);
  }, []);

  return (
    <>
      <div className={styles.property1closed} style={property1ClosedStyle}>
        <div className={styles.hamburgericon}>
          <img
            className={styles.fiBrMenuBurgerIcon}
            alt=""
            src="/fibrmenuburger@2x.png"
            onClick={openSideMenu}
          />
        </div>
        <div className={styles.frameParent}>
          <div
            className={styles.interfaceEssentialbookWrapper}
            onClick={onFrameContainerClick}
          >
            <img
              className={styles.interfaceEssentialbookIcon}
              alt=""
              src="/interface-essentialbook@2x.png"
            />
          </div>
          <img
            className={styles.frameChild}
            alt=""
            src="/frame-33643@2x.png"
            onClick={onFrameIconClick}
          />
          <div className={styles.usericon} onClick={onUsericonContainerClick}>
            <button className={styles.group} onClick={onGroupClick}>
              
              <img className={styles.vectorIcon1} alt="" src="/usericonom@2x.png" />
            </button>
          </div>
          <div
            className={styles.dashoboardsm}
            onClick={onDashoboardSMContainerClick}
          >
            <img
              className={styles.layoutgrid4Icon}
              alt=""
              src={dimensionCode}
            />
          </div>
        </div>
      </div>
      {isSideMenuOpen && (
        <PortalDrawer
          overlayColor="rgba(113, 113, 113, 0.3)"
          placement="Left"
          onOutsideClick={closeSideMenu}
        >
          <SideMenu onClose={closeSideMenu} />
        </PortalDrawer>
      )}
    </>
  );
};

export default Property1Closed;
