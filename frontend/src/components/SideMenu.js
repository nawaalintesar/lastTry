import { useEffect } from "react";
import SidemenuOpenContainer from "./SidemenuOpenContainer";
import styles from "./SideMenu.module.css";

const SideMenu = ({ onClose }) => {
  useEffect(() => {
    const scrollAnimElements = document.querySelectorAll(
      "[data-animate-on-scroll]"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            const targetElement = entry.target;
            targetElement.classList.add(styles.animate);
            observer.unobserve(targetElement);
          }
        }
      },
      {
        threshold: 0.15,
      }
    );

    for (let i = 0; i < scrollAnimElements.length; i++) {
      observer.observe(scrollAnimElements[i]);
    }

    return () => {
      for (let i = 0; i < scrollAnimElements.length; i++) {
        observer.unobserve(scrollAnimElements[i]);
      }
    };
  }, []);
  return (
    <div className={styles.sideMenu} data-animate-on-scroll>
      <div className={styles.hamburgericon}>
        <img
          className={styles.fiBrMenuBurgerIcon}
          alt=""
          src="/fibrmenuburger@2x.png"
          onClick={onClose}
        />
      </div>
      <SidemenuOpenContainer />
    </div>
  );
};

export default SideMenu;
